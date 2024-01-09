document.addEventListener("DOMContentLoaded", async () => {
  const initSqlJs = window.initSqlJs;
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const db = new SQL.Database();

  let sqlStr =
    "CREATE TABLE STUDENT (NAME TEXT, AGE INT);\
    INSERT INTO STUDENT VALUES ('John', 20);\
    INSERT INTO STUDENT VALUES ('Jane', 21);\
    INSERT INTO STUDENT VALUES ('Jack', 22);\
  ";
  db.run(sqlStr);

  const stmt = db.prepare(
    "SELECT * FROM student WHERE NAME=:nameval AND AGE=:ageval"
  );
  const result = stmt.getAsObject({ ":nameval": "Jane", ":ageval": 21 });
  stmt.bind(["Jack", 22]);
  stmt.free();

  // SELECT * FROM student WHERE AGE >= 21
  const runSQL = (db) => {
    const $inpSql = document.getElementById("inp-sql");
    const res = db.exec($inpSql.value)[0];
    // console.log("res", res);
    getTableResult(res);
  };
  const $btnRun = document.querySelector(".btn-run");
  $btnRun.addEventListener("click", () => runSQL(db));
});

const getTableResult = (data) => {
  const columns = data["columns"];
  const values = data["values"];

  const table =
    document.querySelector("table") || document.createElement("table");
  table.innerHTML = "";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const tr = document.createElement("tr");
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  values.forEach((value) => {
    const tr = document.createElement("tr");
    value.forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const $result = document.getElementById("result");
  $result.appendChild(table);
};
