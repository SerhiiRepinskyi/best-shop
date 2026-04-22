import {
  setupFormValidation,
  type FormFieldConfig,
} from "./components/formValidation";
import { isRequired, isValidEmail } from "./utils/validation";

function getFieldConfig(
  form: HTMLFormElement,
  name: string,
  rules: FormFieldConfig["rules"],
): FormFieldConfig | null {
  const control = form.elements.namedItem(name);
  const errorElement = form.querySelector<HTMLElement>(
    `#feedback-${name}-error`,
  );

  if (
    !(
      control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement
    ) ||
    !errorElement
  ) {
    return null;
  }

  return {
    control,
    errorElement,
    rules,
  };
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>(".feedback-form");

  if (!form) {
    return;
  }

  const statusElement = form.querySelector<HTMLElement>(
    ".feedback-form__status",
  );

  const fields = [
    getFieldConfig(form, "name", [
      {
        test: isRequired,
        message: "Please enter your name.",
      },
    ]),
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
    getFieldConfig(form, "topic", [
      {
        test: isRequired,
        message: "Please enter a topic.",
      },
    ]),
    getFieldConfig(form, "message", [
      {
        test: isRequired,
        message: "Please enter your message.",
      },
    ]),
  ].filter((field): field is FormFieldConfig => field !== null);

  setupFormValidation({
    form,
    fields,
    statusElement,
    successMessage: "Thank you! Your message has been sent successfully.",
    errorMessage: "Please fill in all required fields correctly.",
  });
}
