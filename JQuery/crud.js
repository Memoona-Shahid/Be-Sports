const API_URL = "https://jsonplaceholder.typicode.com/posts";
let posts = [];

// DOM elements
const $table = $("#postsTable");
const $form = $("#postForm");
const $loading = $("#loading");
const $saveBtn = $("#saveBtn");
const $cancelEdit = $("#cancelEdit");
const toast = new bootstrap.Toast($("#toast")[0]);

// Show toast message
function showToast(msg, type = "primary") {
  $("#toast").removeClass("text-bg-primary text-bg-success text-bg-danger")
              .addClass(`text-bg-${type}`);
  $("#toastMsg").text(msg);
  toast.show();
}

// Render posts in table
function renderPosts() {
  $table.empty();
  posts.forEach((p) => {
    $table.append(`
      <tr>
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.body}</td>
        <td>
          <button class="btn btn-sm btn-warning editBtn" data-id="${p.id}">Edit</button>
          <button class="btn btn-sm btn-danger deleteBtn" data-id="${p.id}">Delete</button>
        </td>
      </tr>
    `);
  });
}

// Fetch all posts
function fetchPosts() {
  $loading.show();
  $.get(API_URL)
    .done((data) => {
      posts = data.slice(0, 5); // show only first 5 posts
      renderPosts();
      showToast("Posts loaded successfully!", "success");
    })
    .fail(() => showToast("Failed to load posts!", "danger"))
    .always(() => $loading.hide());
}

// Create or Update post
$form.on("submit", function (e) {
  e.preventDefault();
  const id = $("#postId").val();
  const title = $("#title").val().trim();
  const body = $("#body").val().trim();

  if (!title || !body) {
    showToast("Both fields are required!", "danger");
    return;
  }

  if (id) {
    // UPDATE
    $.ajax({
      url: `${API_URL}/${id}`,
      method: "PUT",
      data: { id, title, body, userId: 1 },
    })
      .done(() => {
        const idx = posts.findIndex((p) => p.id == id);
        if (idx > -1) {
          posts[idx] = { id: Number(id), title, body, userId: 1 };
          renderPosts();
          showToast("Post updated!", "success");
        }
        resetForm();
      })
      .fail(() => showToast("Update failed!", "danger"));
  } else {
    // CREATE
    $.post(API_URL, { title, body, userId: 1 })
      .done((res) => {
        const localId = posts.length
          ? Math.max(...posts.map((p) => p.id)) + 1
          : 1;
        const newPost = { id: localId, title, body, userId: 1 };
        posts.unshift(newPost);
        renderPosts();
        showToast("Post added!", "success");
        resetForm();
      })
      .fail(() => showToast("Add failed!", "danger"));
  }
});

// Edit post
$table.on("click", ".editBtn", function () {
  const id = $(this).data("id");
  const post = posts.find((p) => p.id == id);
  if (post) {
    $("#postId").val(post.id);
    $("#title").val(post.title);
    $("#body").val(post.body);
    $saveBtn.text("Update Post");
    $cancelEdit.show();
  }
});

// Delete post
$table.on("click", ".deleteBtn", function () {
  const id = $(this).data("id");
  if (!confirm("Are you sure you want to delete this post?")) return;

  $.ajax({
    url: `${API_URL}/${id}`,
    method: "DELETE",
  })
    .done(() => {
      posts = posts.filter((p) => p.id != id);
      renderPosts();
      showToast("Post deleted!", "success");
    })
    .fail(() => showToast("Delete failed!", "danger"));
});

// Cancel edit
$cancelEdit.on("click", resetForm);

// Reset form state
function resetForm() {
  $form[0].reset();
  $("#postId").val("");
  $saveBtn.text("Add Post");
  $cancelEdit.hide();
}

// Initial fetch
fetchPosts();
