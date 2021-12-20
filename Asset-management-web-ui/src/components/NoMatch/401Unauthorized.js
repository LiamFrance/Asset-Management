import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate()
    return (
        <Result
            status="404"
            title="401"
            subTitle="Sorry, you have to login again"
            extra={<Button type="danger" onClick={() => {
                navigate("/home")
            }}>Back Home</Button>}
        />
    )
}
export default Unauthorized