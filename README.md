Asset's API documentation:
- DEFAULT_URL : /assets
- DEFAULT_URL : POST, PUT -> create, update asset
- DEFAULT_URL?state=&location= : GET assets by location and (or) state
- DEFAULT_URL/{id} GET, DELETE -> get, delete asset by id

----------------------------------------------------------

Assignment's API documentation:
- DEFAULT_URL : /assignments
- DEFAULT_URL : POST, PUT -> create, update assignment
- DEFAULT_URL?state=&location= : GET assignments by location and (or) state
- DEFAULT_URL/{id} GET, DELETE -> get, delete assignment by id
- DEFAULT_URL/{id}?state= PUT -> update state for specific assignment

----------------------------------------------------------

User's API documentation:
- DEFAULT_URL : /users
- DEFAULT_URL : POST, PUT -> create, update user
- DEFAULT_URL?location= : GET users by location 
- DEFAULT_URL/{id} GET, DELETE -> get, delete assignment by id
- DEFAULT_URL/cpwd POST,PUT -> verify old password and change user's password

------------------------------------------------------------
Request Return API documentation: 

- DEFAULT_URL : /returns

- DEFAULT_URL : POST -> CREATE

- DEFAULT_URL : GET -> GEL ALL Return Requests

- DEFAULT_URL/state/{state} -> FILTER REQUEST RETURNS BY STATE

- DEFAULT_URL/returnedDate/{date} -> FILTER REQUEST RETURNS BY STATE

- DEFAULT_URL/astcode/{code} -> SEARCH REQUEST RETURNS BY ASSET CODE

- DEFAULT_URL/astname/{name} -> SEARCH REQUEST RETURNS BY ASSET NAME

- DEFAULT_URL/rqname/{name} -> SEARCH REQUEST RETURNS BY REQUESTER USERNAME

- DEFAULT_URL/{id}?action=complete -> COMPLETE REQUEST

- DEFAULT_URL/{id}?action=cancel -> CANCEL REQUEST

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                   _ooOoo_
//                  o8888888o                                   
//                  88" . "88
//                  (| -_- |)
//                  O\  =  /O
//               ____/`---'\____
//             .'  \\|     |//  `.
//            /  \\|||  :  |||//  \
//           /  _||||| -:- |||||-  \
//           |   | \\\  -  /// |   |
//           | \_|  ''\---/''  |   |
//           \  .-\__  `-`  ___/-. /
//         ___`. .'  /--.--\  `. . __
//      ."" '<  `.___\_<|>_/___.'  >'"".
//     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//     \  \ `-.   \_ __\ /__ _/   .-` /  /
//======`-.____`-.___\_____/___.-`____.-'======
//                   `=---='
//
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//       God Bless     No Bug     Never Crash