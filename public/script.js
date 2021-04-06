const rexipe = {
  username: "Saurav Ghimire",
  title: "Nepali Food",
  ingredients: ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"],
  images: [
    `C:/Users/ghimi/OneDrive/Documents/Projects/JS/node/recipeSharing/public/uploads/images/post-2/img-1617729170224.jpg`,
  ],
  description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor
    quia dicta exercitationem ullam neque nobis blanditiis ex ut nihil
    quisquam, error ipsam illum quae esse reprehenderit obcaecati,
    dignissimos, nemo natus! At officiis quisquam atque nam molestiae
    doloremque, aliquid, laboriosam perspiciatis eos assumenda
    aspernatur! Nesciunt rem quas, sit tempore, voluptate tempora
    expedita quod magnam alias dolor aspernatur veritatis ratione eos
    corrupti. Veniam, at sint impedit voluptatum earum reprehenderit
    maiores inventore natus similique ducimus quasi nisi nemo iusto
    vel, dolorum unde a aliquam. Magnam unde nemo odit laboriosam
    quibusdam reprehenderit repellat libero. Vel eum alias possimus
    vero cupiditate libero officiis, recusandae impedit numquam
    quisquam nobis, deserunt quibusdam maxime molestias tenetur, sint
    architecto tempore iste nostrum magni ea iusto voluptatem harum
    dolores. Tempore. Molestias, explicabo quo id eum repellendus
    consectetur error accusantium molestiae optio voluptate voluptatum
    voluptatibus at laborum eos amet odio distinctio quod, voluptates
    quia ipsum modi reiciendis minima. Adipisci, illo commodi.`,
};

const wrapRecipe = (recipe) => {
  const field = document.getElementById("field");
  const post = document.createElement("div");
  post.classList.add("posts");
  const ingredientsList = recipe.ingredients.reduce(
    (list, elem) => list + `<li>${elem}</li>`,
    `<ol>Ingredients:`
  );

  const numberOfImages = recipe.images.length;
  const imageWidth = 101 / numberOfImages - 1;
  console.log(`Image Width: ${imageWidth}%`);
  const imagesList = recipe.images.reduce(
    (list, elem) => list + `<img src=${elem} style="width: ${imageWidth}%">`,
    ``
  );

  post.innerHTML = `
  <div class="post-header">
    <span>${recipe.username}</span> posted <span>${recipe.title}</span>
  </div><br />
  <div class="post-body">
    <div class="ingredients">${ingredientsList}</ol></div><br />    
    <div class="post-images">${imagesList}</div><br />
    <div class="description">${recipe.description}</div>
  </div>`;

  field.appendChild(post);
};

(async () => {
  const data = await fetch("/view");
  const recipes = await data.json();
  recipes.forEach((elem) => wrapRecipe(elem));
})();

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

//    <div class="post-images">${imagesList}</div><br />
