type FormControl = HTMLInputElement | HTMLTextAreaElement;

type ValidationRule = {
  test: (value: string) => boolean;
  message: string;
};

type FormFieldConfig = {
  control: FormControl;
  errorElement: HTMLElement;
  rules: ValidationRule[];
};

type FormValidationOptions = {
  form: HTMLFormElement;
  fields: FormFieldConfig[];
  statusElement?: HTMLElement | null;
  successMessage: string;
  errorMessage?: string;
  onSuccess?: (form: HTMLFormElement) => void;
};

type ValidationState = {
  isValid: boolean;
  firstError: string | null;
};

function validateField(field: FormFieldConfig): ValidationState {
  const value = field.control.value;

  for (const rule of field.rules) {
    if (!rule.test(value)) {
      return {
        isValid: false,
        firstError: rule.message,
      };
    }
  }

  return {
    isValid: true,
    firstError: null,
  };
}

function showFieldError(field: FormFieldConfig, message: string): void {
  field.control.setAttribute("aria-invalid", "true");
  field.errorElement.textContent = message;
  field.errorElement.hidden = false;
}

function clearFieldError(field: FormFieldConfig): void {
  field.control.setAttribute("aria-invalid", "false");
  field.errorElement.textContent = "";
  field.errorElement.hidden = true;
}

function setStatusMessage(
  statusElement: HTMLElement | null | undefined,
  message: string,
  isError: boolean,
): void {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.hidden = false;
  statusElement.classList.toggle("form__message--error", isError);
  statusElement.classList.toggle("form__message--success", !isError);
}

function clearStatusMessage(statusElement?: HTMLElement | null): void {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = "";
  statusElement.hidden = true;
  statusElement.classList.remove("form__message--error", "form__message--success");
}

export function setupFormValidation(options: FormValidationOptions): void {
  const touchedFields = new WeakSet<FormControl>();

  const runFieldValidation = (
    field: FormFieldConfig,
    shouldShowError: boolean,
  ): boolean => {
    const state = validateField(field);

    if (state.isValid) {
      clearFieldError(field);
      return true;
    }

    if (shouldShowError && state.firstError) {
      showFieldError(field, state.firstError);
    }

    return false;
  };

  const validateAllFields = (): boolean => {
    let isFormValid = true;

    options.fields.forEach((field) => {
      const isFieldValid = runFieldValidation(field, true);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  options.fields.forEach((field) => {
    field.control.addEventListener("blur", () => {
      touchedFields.add(field.control);
      runFieldValidation(field, true);
    });

    field.control.addEventListener("input", () => {
      clearStatusMessage(options.statusElement);

      if (!touchedFields.has(field.control)) {
        return;
      }

      runFieldValidation(field, true);
    });
  });

  options.form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatusMessage(options.statusElement);

    const isFormValid = validateAllFields();

    if (!isFormValid) {
      setStatusMessage(
        options.statusElement,
        options.errorMessage ?? "Please correct the highlighted fields.",
        true,
      );

      const firstInvalidField = options.fields.find(
        (field) => field.control.getAttribute("aria-invalid") === "true",
      );
      firstInvalidField?.control.focus();
      return;
    }

    options.onSuccess?.(options.form);
    options.form.reset();
    options.fields.forEach(clearFieldError);

    setStatusMessage(options.statusElement, options.successMessage, false);
  });
}

export type { FormFieldConfig, ValidationRule };
