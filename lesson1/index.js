import http from "http";

//là để tạo 1 server
//nghe trước, trả về sau
const app = http.createServer((req, res) => {
  //mỗi khi clients gửi request lên (bất kỳ), callback này sẽ được thực thi
  // console.log("ahihi");
  //để trả về được kết quả, chúng ta sẽ sử dụng tham số res
  //end chỉ trả về được file hoặc đinhj dạng string
  //thực hiện convert các định dạng dữ liệu về dạng cú pháp string
  //[1,2,3,4,5]: -> "[1,2,3,4,5]"
  const url = req.url;
  if (url === "/hello") {
    const data = { school: "MindX Technology say hi!" };
    res.end(JSON.stringify(data));
  } else {
    res.end("hello everyone!");
  }
});

//khi được gọi là 1 server thì phải có tính chất
//liên tục lắng nghe những request được gửi lên

//làm thế nào để có thể nhân biết được request gửi lên
//cầ phải cài đặt cho server
//if else, nếu thì...

//port
//dùng http, server trong quá trình chạy ở cổng 8008
// -> truy cập vào đường dẫn http://localhost:8008/
app.listen(8080, () => {
  {
    console.log("Server is running!");
  }
});
