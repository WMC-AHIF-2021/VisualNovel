async function wait(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}

function setDisplay(element: HTMLElement, display: string): void {
  element.style.display = display;
}

setDisplay(document.getElementById("main-content"), "none");

document.addEventListener("DOMContentLoaded", () =>
  wait(1000).then(() => {
    setDisplay(document.getElementById("main-content"), "block");

    setDisplay(document.getElementById("loadingscreen"), "none");
  })
);
