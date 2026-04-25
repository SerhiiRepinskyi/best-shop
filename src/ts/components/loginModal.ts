import {
  setupFormValidation,
  type FormFieldConfig,
} from "./formValidation";
import { loginUser } from "../utils/auth";
import { isRequired, isValidEmail } from "../utils/validation";

function getFieldConfig(
  form: HTMLFormElement,
  name: "email" | "password",
  rules: FormFieldConfig["rules"],
): FormFieldConfig | null {
  const fieldId = `login-${name}`;
  const control = form.elements.namedItem(name);
  const errorElement = form.querySelector<HTMLElement>(`#${fieldId}-error`);

  if (!(control instanceof HTMLInputElement) || !errorElement) {
    return null;
  }

  return {
    control,
    errorElement,
    rules,
  };
}

export function initLoginModal(): void {
  const modal = document.querySelector<HTMLElement>("[data-login-modal]");
  const openButton = document.querySelector<HTMLElement>("[data-login-open]");
  const closeControls = document.querySelectorAll<HTMLElement>("[data-login-close]");
  const form = document.querySelector<HTMLFormElement>(".login-form");
  const passwordInput = document.querySelector<HTMLInputElement>("#login-password");
  const passwordToggle = document.querySelector<HTMLButtonElement>(
    "[data-password-toggle]",
  );

  if (!modal || !openButton || !form || !passwordInput || !passwordToggle) {
    return;
  }

  const statusElement = form.querySelector<HTMLElement>(".login-form__status");
  const rememberCheckbox = form.querySelector<HTMLInputElement>(
    ".login-form__checkbox-input",
  );

  const resetLoginForm = (): void => {
    form.reset();
    passwordInput.type = "password";
    passwordToggle.setAttribute("aria-label", "Show password");
    statusElement?.classList.remove(
      "form__message--error",
      "form__message--success",
    );
    if (statusElement) {
      statusElement.hidden = true;
      statusElement.textContent = "";
    }

    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[aria-invalid]")
      .forEach((field) => {
        field.setAttribute("aria-invalid", "false");
      });

    form.querySelectorAll<HTMLElement>(".login-form__error").forEach((error) => {
      error.hidden = true;
      error.textContent = "";
    });
  };

  const openModal = (): void => {
    resetLoginForm();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
  };

  const closeModal = (): void => {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    resetLoginForm();
  };

  const loginFields = [
    getFieldConfig(form, "email", [
      {
        test: isRequired,
        message: "Please enter your email address.",
      },
      {
        test: isValidEmail,
        message: "Please enter a valid email address.",
      },
    ]),
    getFieldConfig(form, "password", [
      {
        test: isRequired,
        message: "Please enter your password.",
      },
    ]),
  ].filter((field): field is FormFieldConfig => field !== null);

  setupFormValidation({
    form,
    fields: loginFields,
    statusElement,
    successMessage: "You are logged in successfully.",
    errorMessage: "Please fill in the required login fields correctly.",
    onSuccess: () => {
      const emailField = form.elements.namedItem("email");

      if (!(emailField instanceof HTMLInputElement)) {
        return;
      }

      loginUser(emailField.value, Boolean(rememberCheckbox?.checked));
      closeModal();
    },
  });

  openButton.addEventListener("click", openModal);

  closeControls.forEach((control) => {
    control.addEventListener("click", closeModal);
  });

  passwordToggle.addEventListener("click", () => {
    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";
    passwordToggle.setAttribute(
      "aria-label",
      isPasswordVisible ? "Show password" : "Hide password",
    );
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}
