const checkbox = $(".compare_checkbox");
const compare_button = $(".compare__button");
const remove_button = $(".remove_button");
const nav = $(".pres_nav");
$(".hide_target").hide();
$(`#know`).show();

checkbox.each((i, check) => {
  const target_id = check.dataset.targetId;
  if ($(check).is(":checked")) {
    $(`.${target_id}`).show();
  } else {
    $(`.${target_id}`).hide();
  }
});

const show_page = target => {
  $(".hide_target").hide();
  $(`#${target}`).show();
};

nav.on("click", e => {
  const target_id = e.target.dataset.target_id;
  nav.each((i, value) => (value.classList = "nav-link"));
  e.target.classList = "active";
  show_page(target_id);
  $(window).scrollTop(0);
});

checkbox.on("change", e => {
  const target_id = e.target.dataset.targetId;
  if ($(e.target).is(":checked")) {
    $(`.${target_id}`).show();
  } else {
    $(`.${target_id}`).hide();
  }
});

compare_button.on("click", e => {
  const target_id = e.target.dataset.targetId;
  nav.each((i, value) => (value.classList = ""));
  $("#compare_li").addClass("active");
  $(window).scrollTop(0);
  show_page(target_id);
});

remove_button.on("click", e => {
  const target_id = e.target.dataset.targetId;
  $(`.${target_id}`).hide();
  $(`#input${target_id}`).prop("checked", false);
});

// Window Events
window.scrollTo({ top: 0, behavior: "smooth" });
window.onbeforeprint = function() {
  $(".hide_target").show();
};
window.onafterprint = function() {
  $(".hide_target").hide();
  $(`#know`).show();
  $("#know_li").click();
};
