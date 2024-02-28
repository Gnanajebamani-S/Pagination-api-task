var container = document.createElement("div");
container.classList.add("container", "table-striped");
var table = document.createElement("table");
table.classList.add("table");

var thead = document.createElement("thead");
thead.classList.add("bg-dark", "text-light");

var trHead = document.createElement("tr");
var tdHead1 = document.createElement("td");
tdHead1.innerHTML = "Id";
var tdHead2 = document.createElement("td");
tdHead2.innerHTML = "Name";
var tdHead3 = document.createElement("td");
tdHead3.innerHTML = "Email";

var tbody = document.createElement("tbody");
tbody.setAttribute("id", "table-body");

var pagination = document.createElement("div");
pagination.setAttribute("id", "pagination-wrapper");
pagination.classList.add("container", "buttons");

trHead.append(tdHead1, tdHead2, tdHead3);

thead.append(trHead);

table.append(thead, tbody);

container.append(table);

document.body.append(container, pagination);

function createTableRow(id, name, email) {
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  td1.innerHTML = id;
  td2.innerHTML = name;
  td3.innerHTML = email;
  tr.append(td1, td2, td3);
  tbody.append(tr);
}

// pagination Logic

var request = new XMLHttpRequest();
request.open(
  "GET",
  "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json",
  true
);
request.send();
request.onload = function () {
  var tabledata = JSON.parse(this.response);

  var state = {
    queryset: tabledata,
    page: 1,
    rows: 10,
    window: 10,
  };

  buildTable();

  function pagination(queryset, page, rows) {
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows;
    var trimedData = queryset.slice(trimStart, trimEnd);
    var pages = Math.ceil(tabledata.length / rows);
    return {
      queryset: trimedData,
      pages: pages,
    };
  }

  function pageButtons(pages) {
    var wrapper = document.getElementById("pagination-wrapper");
    wrapper.innerHTML = "";
    var maxLeft = state.page - Math.floor(state.window / 2);
    var maxRight = state.page + Math.floor(state.window / 2);
    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = state.window;
    }
    if (maxRight > pages) {
      maxLeft = pages - (state.window - 1);
      maxRight = pages;
      if (maxLeft < 1) {
        maxLeft = 1;
      }
    }
    for (var page = maxLeft; page <= maxRight; page++) {
      wrapper.innerHTML =
        wrapper.innerHTML +
        `<button value="${page}" class="page">${page}</button>`;
    }
    if (state.page !== 1) {
      wrapper.innerHTML =
        `<button value=${1} class="page">&#171; First</button>` +
        wrapper.innerHTML;
    }
    if (state.page != pages) {
      wrapper.innerHTML += `<button value=${pages} class="page">Last &#187;</button>`;
    }

    var dynamic = document.getElementById("pagination-wrapper");

    dynamic.addEventListener("click", function (e) {
      document.getElementById("table-body").innerHTML = "";
      state.page = Number(e.target.value);
      buildTable();
    });
  }

  function buildTable() {
    var data = pagination(state.queryset, state.page, state.rows);
    var array = data.queryset;
    for (var i = 0; i < array.length; i++) {
      createTableRow(array[i].id, array[i].name, array[i].email);
    }
    pageButtons(data.pages);
  }
};
