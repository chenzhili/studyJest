import { test } from '../src/utls'

describe('测试 matches', () => { 
    it('第一个 test', () => {
        expect(test(1, 1)).toBe(2)
    })
})
it('第一个 it', () => {
    expect(test(1, 1)).toBe(2)
})
describe("测试 it 和 test的区别",()=>{
    it('return test',()=>{
        expect(1).toBe(1);
    })
})