import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import App from "./App";


afterEach(cleanup)
describe('ren', () => {
    test("renders learn react link", () => {
        render(<App/>);
        const linkElement = screen.getByText(/learn react/i);
        expect(linkElement).toBeInTheDocument();
    })
})

