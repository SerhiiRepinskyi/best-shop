import {
  setupFormValidation,
  type FormFieldConfig,
} from "./formValidation";
import { isRequired, isValidEmail } from "../utils/validation";

function getFieldConfig(
  form: HTMLFormElement,
  name: string,
  rules: FormFieldConfig["rules"],
): FormFieldConfig | null {
  const control = form.elements.namedItem(name);
  const errorElement = form.querySelector<HTMLElement>(
    `#product-review-${name}-error`,
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

function createRatingInputMarkup(value: number): string {
  return `
    <label class="product-reviews__rating-option" aria-label="Rate ${value} out of 5">
      <input
        class="product-reviews__rating-input"
        type="radio"
        name="rating"
        value="${value}"
      />
      <span class="product-reviews__rating-star" aria-hidden="true">&#9733;</span>
    </label>
  `;
}

export function createProductReviewsMarkup(productName: string): string {
  return `
    <div class="product-reviews">
      <div class="product-reviews__list-column">
        <h3 class="product-reviews__heading">1 review for ${productName}</h3>

        <article class="product-review-card">
          <img
            class="product-review-card__avatar"
            src="/assets/images/product/review-customer.webp"
            alt="Ella Harper"
            width="46"
            height="46"
          />

          <div class="product-review-card__body">
            <div class="product-review-card__meta">
              <div class="product-review-card__author-group">
                <p class="product-review-card__author">Ella Harper</p>
                <p class="product-review-card__date">/ June 11, 2025</p>
              </div>

              <div
                class="product-review-card__rating"
                aria-label="Rated 4 out of 5"
              >
                <span class="product-review-card__star">&#9733;</span>
                <span class="product-review-card__star">&#9733;</span>
                <span class="product-review-card__star">&#9733;</span>
                <span class="product-review-card__star">&#9733;</span>
                <span class="product-review-card__star product-review-card__star--muted">&#9733;</span>
              </div>
            </div>

            <p class="product-review-card__text">
              Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius
              eget urna sit amet luctus. Suspendisse potenti curabitur ac
              placerat est, sit amet sodales risus.
            </p>
          </div>
        </article>
      </div>

      <div class="product-reviews__form-column">
        <h3 class="product-reviews__heading">Add Review</h3>
        <p class="product-reviews__intro">
          Your email address won&apos;t be shared with anybody. Required fields
          have the symbol <span class="product-reviews__required">*</span>
        </p>

        <form class="form review-form" action="#" method="post" novalidate>
          <div class="review-form__topline">
            <p class="review-form__rating-label">Rate Product</p>

            <div class="product-reviews__rating" aria-label="Choose product rating">
              ${[1, 2, 3, 4, 5]
                .map((value) => createRatingInputMarkup(value))
                .join("")}
            </div>
          </div>

          <div class="form__field review-form__field review-form__field--textarea">
            <textarea
              class="form__textarea review-form__textarea"
              id="product-review-review"
              name="review"
              placeholder="Your Review*"
              aria-describedby="product-review-review-error"
              required
            ></textarea>
            <p
              class="form__message form__message--error review-form__error"
              id="product-review-review-error"
              hidden
            ></p>
          </div>

          <div class="review-form__row">
            <div class="form__field review-form__field">
              <input
                class="form__input review-form__input"
                type="text"
                id="product-review-name"
                name="name"
                placeholder="Your Name*"
                aria-describedby="product-review-name-error"
                required
              />
              <p
                class="form__message form__message--error review-form__error"
                id="product-review-name-error"
                hidden
              ></p>
            </div>

            <div class="form__field review-form__field">
              <input
                class="form__input review-form__input"
                type="email"
                id="product-review-email"
                name="email"
                placeholder="Your Email*"
                aria-describedby="product-review-email-error"
                required
              />
              <p
                class="form__message form__message--error review-form__error"
                id="product-review-email-error"
                hidden
              ></p>
            </div>
          </div>

          <label class="review-form__checkbox">
            <input
              class="review-form__checkbox-input"
              type="checkbox"
              name="remember-reviewer"
            />
            <span class="review-form__checkbox-box" aria-hidden="true"></span>
            <span class="review-form__checkbox-label">
              Save my name, email, and website in this browser for when I leave
              another comment.
            </span>
          </label>

          <button class="btn review-form__submit" type="submit">Submit</button>

          <p class="form__message review-form__status" aria-live="polite" hidden></p>
        </form>
      </div>
    </div>
  `;
}

export function initProductReviewsForm(panel: HTMLElement): void {
  const form = panel.querySelector<HTMLFormElement>(".review-form");

  if (!form) {
    return;
  }

  const statusElement = form.querySelector<HTMLElement>(".review-form__status");

  const fields = [
    getFieldConfig(form, "review", [
      {
        test: isRequired,
        message: "Please enter your review.",
      },
    ]),
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
  ].filter((field): field is FormFieldConfig => field !== null);

  setupFormValidation({
    form,
    fields,
    statusElement,
    successMessage: "Thank you! Your review has been submitted successfully.",
    errorMessage: "Please fill in all required review fields correctly.",
  });
}
