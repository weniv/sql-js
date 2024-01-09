document.addEventListener("DOMContentLoaded", async () => {
  const initSqlJs = window.initSqlJs;
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const db = new SQL.Database();

  // create table
  // csv 파일을 불러와서 table로 만들기
  const getTableCSV = async (file) => {
    fetch(`/src/data/${file}.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const columns = Object.keys(data[0]);
        const values = data.map((value) => Object.values(value));
        const sqlStr = `CREATE TABLE ${file} (${columns.join(
          " TEXT, "
        )} TEXT);`;
        db.run(sqlStr);
        const stmt = db.prepare(
          `INSERT INTO ${file} VALUES (${columns.map(() => "?").join(",")})`
        );
        values.forEach((value) => stmt.run(value));
        stmt.free();
      });
  };
  getTableCSV("student");
  getTableCSV("subject");
  getTableCSV("professor");
  getTableCSV("major");
  getTableCSV("grade");
  getTableCSV("scholarship");
  getTableCSV("tuition");
  getTableCSV("mileage");
  getTableCSV("invalid_data");

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
