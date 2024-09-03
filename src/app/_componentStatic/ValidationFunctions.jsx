import debounce from "lodash.debounce";

export function validateName(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    var reg = /^[a-z A-Z]+$/;

    if (!value || typeof value !== "string") {
      element.textContent = `${error} is Required`;
    } else if (!value.trim()) {
      element.textContent = `${error} is Required`;
    } else if (!reg.test(value)) {
      element.textContent = `Please Enter a Valid ${error}`;
    } else {
      element.textContent = "";
    }
  }, 300);

  debouncedFunction();
}

export function validateAddress(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    if (!value.trim()) {
      element.textContent = `${error} is Required`;
    } else {
      element.textContent = "";
    }
  }, 300);
  debouncedFunction();
}

export function validatePostCode(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    if (!value.trim()) {
      element.textContent = `${error} is Required`;
    } else if (isNaN(value)) {
      element.textContent = `Please Enter a Valid ${error}`;
    } else {
      element.textContent = "";
    }
  }, 300);

  debouncedFunction();
}

export function validateEmail(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (typeof value === "string" && value.trim()) {
      if (!reg.test(value)) {
        element.textContent = `Please Enter a Valid ${error}`;
      } else {
        element.textContent = "";
      }
    } else {
      element.textContent = `${error} is Required`;
    }
  }, 300);

  debouncedFunction();
}

export function validateTelephone(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    if (!value.trim()) {
      element.textContent = `${error} is Required`;
    } else if (isNaN(value) || value.length < 10) {
      element.textContent = `Please Enter a Valid ${error}`;
    } else {
      element.textContent = "";
    }
  }, 300);

  debouncedFunction();
}

export function validatePass(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    if (value.length < 8) {
      element.textContent = `${error} should contain atleast 8 characters`;
    } else {
      element.textContent = "";
    }
  }, 300);

  debouncedFunction();
}

export function validateCpass(value, id, error) {
  const debouncedFunction = debounce(() => {
    const element = document.querySelector(`#${id} + .error_1`);
    const passwordValue = document.getElementById("pass").value;

    if (value.length < 8) {
      element.textContent = `${error} should contain atleast 8 characters`;
    } else if (value !== passwordValue) {
      element.textContent = `${error} do not match`;
    } else {
      element.textContent = "";
    }
  }, 300);

  debouncedFunction();
}
