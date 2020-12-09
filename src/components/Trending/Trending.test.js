import Trending from "./Trending";
import Enzyme, { shallow } from "enzyme";
import "@testing-library/jest-dom/extend-expect"
import Adapter from 'enzyme-adapter-react-16';
import { fireEvent, render } from "@testing-library/react";
import { useState } from "react";
Enzyme.configure({ adapter: new Adapter() });

describe("Trending component test cases.",()=> {
    test("should render without throwing an error", () => {
        expect(shallow(<Trending/>)).toHaveLength(1);
    });
    test('Correctly renders search field', () => {
        const trending = shallow(<Trending />);
        expect(trending.find('#search').at(0).prop('value')).toEqual('');
    });
    test('Correctly triggers change event with empty value', () => {
        const {getByTestId} = render(<Trending />);
        const input = getByTestId('search');
        fireEvent.change(input);
        expect(input.children[1].children[0].value).toBe('');
    });
    test('Correctly triggers change event with some value', () => {
        const trending = render(<Trending />);
        const input = trending.getByTestId('search');
        fireEvent.change(input.children[1].children[0], {target:{value:'foo'}});
        expect(input.children[1].children[0].value).toBe('foo');
    });

    test('Correctly triggers date change event for today', () => {
        const trending = render(<Trending />);
        const input = trending.getByTestId('date').children[0].children[1].children[0];
        fireEvent.change(input, {target:{textContent:'Today'}});
        expect(input.value).toBe('Today');
    });
})

