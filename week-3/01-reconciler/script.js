
// What are u looking for?
// You'll get it on Friday you lazy porson

function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");

  // Get the current children of the parent element and convert it to an array
  // var currentChildren = Array.from(parentElement.children);
  // Optimization-1: converting the current childrent into an object with id as the key and it hold the todo item as value
  var currentChildren = new Map(Array.from(parentElement.children).map((child) => {
    return [child.dataset.id,child];
  }));
  

  // Process each item in the data array
  data.forEach(function(item) {
    // Check if a child with this ID already exists
    // var existingChild = currentChildren.find(function(child) {
    //   return child.dataset.id === String(item.id);
    // });
    var existingChild = currentChildren.get(String(item.id));

    if (existingChild) {
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      // console.log(`Updating child with ID: ${existingChild.dataset.id}`);
      // Remove it from the currentChildren array
      // currentChildren = currentChildren.filter(function(child) {
      //   return child !== existingChild;
      // });
      currentChildren.delete(String(item.id));
    } else {
      // If it doesn't exist, create it
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete"
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")")

      childElement.appendChild(grandChildElement1)
      childElement.appendChild(grandChildElement2)
      childElement.appendChild(grandChildElement3)
      parentElement.appendChild(childElement);
    }
  });

  // Any children left in the currentChildren array no longer exist in the data, so remove them
  // currentChildren.forEach(function(child) {
  //   parentElement.removeChild(child);
  // });
  for(let child of currentChildren.values()){
    parentElement.removeChild(child);
  }
}

window.setInterval(() => {
  let todos = [];
  let newElements = Math.floor(Math.random()*100);

  for (let i = 0; i<newElements; i++) {
    todos.push({
      title: "Go to gym",
      description: "Go to gym form 5",
      id: i+1
    })
  }
  // console.clear();
  let startTime = performance.now();
  createDomElements(todos)
  let endTime = performance.now();
  let elapsedTime = endTime - startTime;
  console.log(`Time elapsed : ${elapsedTime*1000} microseconds for adding ${newElements}`);
}, 3000)
