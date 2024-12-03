const path = require("path");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded());
// app.use((req, res) => {
//   console.log('shiuuu the goat')
//   res.send('<h1>Masok Shiuuu</h1>');
// })


const listMenu = require("./data/menus.json");
const { default: mongoose } = require("mongoose");

mongoose.connect('mongodb://localhost/shop_db').then((res) => {
  console.log('connected to mongodb')
}).catch((err) => {
  console.log("🚀 ~ mongoose.connect ~ err:", err)
})

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/random", (req, res) => {
  const numberRandom = Math.floor(Math.random() * 10);
  res.render("random", {
    listMenu,
    random: numberRandom,
    berita: { title: "Random" },
  });
});

app.get("/post/:tag", (req, res) => {
  const { tag } = req.params;
  res.render("post", { tag });
});

app.get("/berita/:jenis/:kategori", async (req, res) => {
  try {
    const { jenis, kategori } = req.params;
    await fetch(`https://api-berita-indonesia.vercel.app/${jenis}/${kategori}`)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // console.log("cek hasil", result);
        // console.log("🚀 ~ app.get ~ berita:", berita);
        const { data } = result;
        res.render("berita", { berita: data });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
});

app.get("/t/:tag", (req, res) => {
  const { tag } = req.params;
  const listData = require("./data/news.json");
  const data = listData[tag];
  if (data) {
    res.render("tag", { listMenu, berita: data, tag });
  } else {
    res.render("notfound", { tag });
  }
});

app.get("/kucing", (req, res) => {
  const kucings = ["dadang", "yanto", "anton"];
  res.render("kucing", { kucings });
});

app.post("/kucing", (req, res) => {
  res.json({
    status: "success",
    message: "berhasil",
    data: req.body,
  });
});

app.get("/berita/:judul/:kategori/:tanggal", (req, res) => {
  res.json({
    status: "success",
    message: "berhasil",
    data: req.params,
  });
});

app.get("/search", (req, res) => {
  res.json({
    status: "success",
    message: "berhasil",
    data: req.query,
  });
});

app.get("/order", (req, res) => {
  res.send("GET order response");
});

app.get("*", (req, res) => {
  res.send("<center><h1>Halaman tidak di temukan</h1></center>");
});

app.listen(8080, () => {
  console.log("server is running on http://localhost:8080");
});
