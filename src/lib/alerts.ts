// SweetAlert2 popups for the admin, restyled in globals.css (`.mb-swal-*`) to fit DESIGN.md:
// square corners, hairline border, no shadow, ink/ivory/brass. Loaded on demand so the
// library stays out of the shop's bundles.

/** Confirms a successful "add". Closes by itself; the popup survives client-side navigation. */
export async function notifyAdded(title: string, text?: string) {
  const { default: Swal } = await import("sweetalert2");
  await Swal.fire({
    icon: "success",
    iconColor: "#b8955a", // lux-brass
    title,
    text,
    timer: 2200,
    timerProgressBar: true,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "mb-swal-popup",
      title: "mb-swal-title",
      htmlContainer: "mb-swal-text",
      confirmButton: "mb-swal-button",
      timerProgressBar: "mb-swal-progress",
    },
  });
}
