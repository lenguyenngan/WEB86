import express from "express";
import { customers } from "./data.js";
const app = express();
//đây là dòng giúp app
app.use(express.json());

app.get("", (req, res) => {
  res.end("Hello MindX!");
});

app.get("/customers", (req, res) => {
  const queryParams = req.query;
  console.log(queryParams);
  res.send(customers);
});

//param - chỉ định rõ ràng dữ liệu cần lấy là gì
// có 1 apo lấy chi tiết thông tin của 1 user
app.get("/customers/:id", (req, res) => {
  // /customers/1   -> id = 1
  // /customers/2   -> id = 2     express hỗ trợ xử lý
  // cú pháp
  const { id } = req.params;
  const customer = customers.find((item) => item.id === id);
  res.send(customer);
  // với id là tên bất kỳ (tên gì cũng được - nhưng nên đặt là id)
});

//tạo (thêm) dữ liệu
//POST - ứng dụng trong việc tạo/thêm mới dữ liệu
//how to gửi dữ liệu lên api
//khái niệm: body - chỉ hành động đính kèm dữ liệu theo api khi req
app.post("/customers", (req, res) => {
  // cú pháp để lấy dữ liệu được đính kèm trên api
  // dữ liệu này là 1 objects
  const data = req.body;
  console.log(data);
});

app.listen(8080, () => {
  console.log("Server is running!");
});
