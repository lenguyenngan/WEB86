import express from "express";
import { customers, orders, products } from "./data.js";

const app = express();
const port = 3000;
app.use(express.json());

//câu 1
app.get("/customers", (req, res) => {
  res.send(customers);
});

//câu 22
app.get("/customers/:id", (req, res) => {
  const customer = customers.find((customer) => customer.id === req.params.id);
  if (customer) {
    res.send(customer);
  } else {
    res.status(404).send("Customer not found");
  }
});

//câu 3
app.get("/customers/:customerId/orders", (req, res) => {
  const { customerId } = req.params;
  const customerOrders = orders.filter(
    (order) => order.customerId === customerId
  );
  if (customerOrders.length > 0) {
    res.send(customerOrders);
  } else {
    res.status(404).send("Orders not found");
  }
});

//câu 4
app.get("/orders/highvalue", (req, res) => {
  const listOrder = orders.filter((item) => item.totalPrice >= 10000000);
  res.send(listOrder);
});

//cau 5 ?id=1&name=Huyen
// là cách 1
// app.get("/products", (req, res) => {
//   const { minPrice, maxPrice } = req.query;
//   const min = minPrice ? Number(minPrice) : 0;
//   const max = maxPrice ? Number(maxPrice) : Infinity;
//   const filteredProducts = products.filter(
//     (pro) => pro.price >= min && pro.price <= max
//   );
//   res.json(filteredProducts);
// });

//là cách 2
app.get("/products", (req, res) => {
  const { minPrice, maxPrice, name } = req.query;
  const min = parseInt(minPrice);
  const max = parseInt(maxPrice);
  const filteredProducts = products.filter(
    (pro) => pro.price >= min && pro.price <= max
  );
  res.send(filteredProducts.filter((product) => product.name.includes(name)));
});

//cau 6
app.post("/customers", (req, res) => {
  const body = req.body;
  console.log("🚀 ~ app.post ~ body:", body);

  //check email not exist
  const existedCustomerEmail = customers.find(
    (customer) => customer.email === body.email
  );
  if (existedCustomerEmail) {
    res.status(400).send({
      message: "Email đã tồn tại",
    });
  }

  customers.push(body);
  res.status(200).send({
    message: "Add customer successfully",
    data: body,
  });
});

//cau 7
app.post("/orders", (req, res) => {
  const { orderId, customerId, productId, quantity } = req.body;

  //kiểm tra các thông tin bắt buộc
  if (!orderId || !customerId || !productId || !quantity) {
    return res.status(400).send({ message: "All fields are required" });
  }

  //kiểm tra sản phẩm có tồn tại không
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(400).send({ message: "Product not found" });
  }

  //kiểm tra số lượng hợp lýý
  if (quantity > product.quantity) {
    return res
      .status(400)
      .send({ message: " Quantity exceeds available stock" });
  }

  //tính totalPrice
  const totalPrice = product.price * quantity;

  //tạo đơn hàng mới
  const newOrder = {
    orderId,
    customerId,
    productId,
    quantity,
    totalPrice,
  };

  //thêm đơn hàng vào danh sách
  orders.push(newOrder);

  //cập nhật số lượng sản phẩm còn lại
  product.quantity -= quantity;

  //phản hồi kết quả
  res.status(201).send({
    message: "Order created successfully",
    data: newOrder,
  });
});

//cau 8
app.put("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { quantity } = req.body;

  // Kiểm tra đầu vào
  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .send({ message: "Quantity must be a positive number." });
  }

  // Tìm đơn hàng
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) {
    return res.status(404).send({ message: "Order not found." });
  }

  // Tìm sản phẩm liên quan
  const product = products.find((p) => p.id === order.productId);
  if (!product) {
    return res
      .status(404)
      .send({ message: "Product not found for this order." });
  }

  // Kiểm tra số lượng sản phẩm còn lại
  const availableQuantity = product.quantity + order.quantity;
  if (quantity > availableQuantity) {
    return res
      .status(400)
      .send({ message: "Quantity exceeds available stock." });
  }

  // Cập nhật sản phẩm và đơn hàng
  product.quantity = availableQuantity - quantity;
  order.quantity = quantity;
  order.totalPrice = quantity * product.price;

  // Phản hồi kết quả
  res.status(200).send({
    message: "Order updated successfully",
    data: order,
  });
});

//cau 9
app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;

  //tìm chỉ số của khách hàng trong mảng `customers`
  const customerIndex = customers.findIndex((customer) => customer.id === id);

  //nếu không tìm thấy khách hàng, trả về lỗi 404404
  if (customerIndex === -1) {
    return res.status(404).send({ message: "Customer not found" });
  }
  //xóa khách hàng khỏi mảng `customers`
  const deleteCustomer = customers.splice(customerIndex, 1);

  //trả về phản hồi thành công
  res.status(200).send({
    message: "Customer deleted successfully",
    data: deleteCustomer[0],
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
