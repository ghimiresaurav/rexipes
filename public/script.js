const MAX_IMAGES = 5;
const wrapRecipe = (recipe) => {
  const field = document.getElementById("field");
  const post = document.createElement("div");
  post.classList.add("posts");
  const ingredientsList = recipe.ingredients.reduce(
    (list, elem) => list + `<li>${elem}</li>`,
    `<ol>Ingredients:`
  );
  const hasImages = recipe.images ? true : false;
  //adjust images
  let numberOfImages, imageWidth, imagesList;
  if (hasImages) {
    numberOfImages = recipe.images.length;
    imageWidth = 101 / numberOfImages - 1;
    imagesList = recipe.images.reduce(
      (list, elem) => list + `<img src=${elem} style="width: ${imageWidth}%">`,
      ``
    );
  }

  post.innerHTML = `
  <div class="post-header">
    <span>${recipe.username}</span> posted <span>${recipe.title}</span>
  </div><br />
  <div class="post-body">
    <div class="ingredients">${ingredientsList}</ol></div><br />`;

  if (hasImages)
    post.innerHTML += `<div class="post-images">${imagesList}</div><br />`;

  post.innerHTML += `<div class="description">${recipe.description}</div>
  </div>`;

  field.appendChild(post);
};

setTimeout(async () => {
  const data = await fetch("/view");
  const recipes = await data.json();
  recipes.forEach((elem) => wrapRecipe(elem));
}, 100);

const submitRecipe = (e) => {
  e.preventDefault();
  const postForm = document.getElementById("post-form");
  const formData = new FormData(postForm);

  const options = {
    method: "POST",
    body: formData,
  };

  fetch("/new-recipe", options);

  document.getElementById("recipe-title").value = "";
  document.getElementById("recipe-ing").value = "";
  document.getElementById("recipe-des").value = "";
  document.getElementById("recipe-user").value = "";

  const notification = document.getElementById("notification");
  notification.innerHTML = `Your recipe has been posted! <i class="far fa-thumbs-up"></i>`;
  notification.style.transform = "translateY(30px)";
  setTimeout(() => {
    notification.style.transform = "translateY(0)";
    setTimeout(() => (notification.innerHTML = ""), 150);
  }, 3000);
};

document.getElementById("file-input").addEventListener("change", () => {
  if (this["file-input"].files.length > MAX_IMAGES)
    alert(`Uploading more than ${MAX_IMAGES} images is not recomended.`);
});
