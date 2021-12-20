import React from "react";
import {cleanup} from "@testing-library/react";
import LoginPage, {validateInput} from "../components/LoginPage/LoginPage";
import Enzyme, {shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});


beforeEach(cleanup)
const setInputFieldValue = (comp, name, value) => {
    comp.find(`input[name='${name}']`).simulate("change", {
        target: {name: `${name}`, value: `${value}`},
        persist: () => {
        }
    });
};
describe('login', () => {
    test("validate func should username on incorrect input", () => {
        const text = "adminHN"
        expect(validateInput(text)).toBe(true)
    })
    test("validate func should username on incorrect input", () => {
        const text = ""
        expect(validateInput(text)).not.toBe(true)
    })
    test("validate func should password on incorrect input", () => {
        const text = "adminHN"
        expect(validateInput(text)).toBe(true)
    })
    test("validate func should password on incorrect input", () => {
        const text = ""
        expect(validateInput(text)).not.toBe(true)
    })
})
describe("with valid input", () => {
    const handler = jest.fn(() => Promise.resolve())
    it("with only password", async () => {
        // const {getByTestId}  = render(
        //     <Router>
        //         <Routes>
        //             <Route element={<LoginPage callback={handler} />}/>
        //         </Routes>
        //     </Router>
        // );

        const mockFunc = jest.fn();

        // set up Input, with mockFunc as a prop
        const wrapper = shallow(<LoginPage onSubmit={mockFunc}/>).dive();
        const submit = wrapper.find("Button[htmlType='submit']");
        submit.simulate("click", {
            preventDefault() {
            }
        });
        const clickFunc = mockFunc.mock.calls.length;
        expect(clickFunc).toBe(1);
        // fireEvent.change(getByTestId("password"), {
        //     target: { value: "passw0rd" }
        // });
        //
        // fireEvent.click(getByTestId("signInButton"));
        //
        // expect(handler).toBeCalledWith({ password: "passw0rd" });
    });

})
