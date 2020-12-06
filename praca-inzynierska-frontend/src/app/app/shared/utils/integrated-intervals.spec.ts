import { IntegratedIntervals } from './integrated-intervals'

describe("IntegratedIntervals", () => {

    it("initial state", () => {
        let ii = new IntegratedIntervals()
        
        expect(ii.sum(-10)).toEqual(0)
        expect(ii.sum(0)).toEqual(0)
        expect(ii.sum(10)).toEqual(0)
        expect(ii.intergral(-1000000, 1000000)).toEqual(0)
        expect(ii.limitedIntegral(-1000000, 1000000, 10000000)).toEqual(0)
    })

    it("single interval", () => {
        let ii = new IntegratedIntervals()

        ii.add(3, 5, 2)

        expect(ii.sum(2)).toEqual(0)
        expect(ii.sum(3)).toEqual(2)
        expect(ii.sum(4)).toEqual(2)
        expect(ii.sum(5)).toEqual(0)

        expect(ii.intergral(0, 2)).toEqual(0)
        expect(ii.intergral(0, 3)).toEqual(0)
        expect(ii.intergral(0, 4)).toEqual(2)
        expect(ii.intergral(0, 10)).toEqual(4)
        expect(ii.intergral(3, 5)).toEqual(4)
        expect(ii.intergral(4, 5)).toEqual(2)
        expect(ii.intergral(5, 5)).toEqual(0)
        expect(ii.intergral(5, 6)).toEqual(0)

        expect(ii.limitedIntegral(0, 2, 1)).toEqual(0)
        expect(ii.limitedIntegral(0, 3, 1)).toEqual(0)
        expect(ii.limitedIntegral(0, 4, 1)).toEqual(1)
        expect(ii.limitedIntegral(0, 10, 1)).toEqual(2)
        expect(ii.limitedIntegral(3, 5, 1)).toEqual(2)
        expect(ii.limitedIntegral(4, 5, 1)).toEqual(1)
        expect(ii.limitedIntegral(5, 5, 1)).toEqual(0)
        expect(ii.limitedIntegral(5, 6, 1)).toEqual(0)
    })

    it("two intervals", () => {
        let ii = new IntegratedIntervals()

        ii.add(3, 5, 2)
        ii.add(4, 6, 3)

        expect(ii.sum(2)).toEqual(0)
        expect(ii.sum(3)).toEqual(2)
        expect(ii.sum(4)).toEqual(5)
        expect(ii.sum(5)).toEqual(3)
        expect(ii.sum(6)).toEqual(0)
        expect(ii.sum(7)).toEqual(0)

        expect(ii.intergral(0, 2)).toEqual(0)
        expect(ii.intergral(0, 3)).toEqual(0)
        expect(ii.intergral(0, 4)).toEqual(2)
        expect(ii.intergral(0, 10)).toEqual(10)
        expect(ii.intergral(3, 5)).toEqual(7)
        expect(ii.intergral(4, 5)).toEqual(5)
        expect(ii.intergral(5, 5)).toEqual(0)
        expect(ii.intergral(5, 6)).toEqual(3)

        expect(ii.limitedIntegral(0, 2, 4)).toEqual(0)
        expect(ii.limitedIntegral(0, 3, 4)).toEqual(0)
        expect(ii.limitedIntegral(0, 4, 4)).toEqual(2)
        expect(ii.limitedIntegral(0, 10, 4)).toEqual(9)
        expect(ii.limitedIntegral(3, 5, 4)).toEqual(6)
        expect(ii.limitedIntegral(4, 5, 4)).toEqual(4)
        expect(ii.limitedIntegral(5, 5, 4)).toEqual(0)
        expect(ii.limitedIntegral(5, 6, 4)).toEqual(3)
    })

    it("three intervals", () => {
        let ii = new IntegratedIntervals()

        ii.add(3, 5, 2)
        ii.add(6, 8, 1)
        ii.add(4, 7, 3)

        expect(ii.sum(2)).toEqual(0)
        expect(ii.sum(3)).toEqual(2)
        expect(ii.sum(4)).toEqual(5)
        expect(ii.sum(5)).toEqual(3)
        expect(ii.sum(6)).toEqual(4)
        expect(ii.sum(7)).toEqual(1)
        expect(ii.sum(8)).toEqual(0)

        expect(ii.intergral(0, 2)).toEqual(0)
        expect(ii.intergral(0, 3)).toEqual(0)
        expect(ii.intergral(0, 4)).toEqual(2)
        expect(ii.intergral(0, 10)).toEqual(15)
        expect(ii.intergral(3, 5)).toEqual(7)
        expect(ii.intergral(4, 5)).toEqual(5)
        expect(ii.intergral(5, 5)).toEqual(0)
        expect(ii.intergral(5, 6)).toEqual(3)
        expect(ii.intergral(5, 7)).toEqual(7)
        expect(ii.intergral(5, 8)).toEqual(8)

        expect(ii.limitedIntegral(0, 2, 3)).toEqual(0)
        expect(ii.limitedIntegral(0, 3, 3)).toEqual(0)
        expect(ii.limitedIntegral(0, 4, 3)).toEqual(2)
        expect(ii.limitedIntegral(0, 10, 3)).toEqual(12)
        expect(ii.limitedIntegral(3, 5, 3)).toEqual(5)
        expect(ii.limitedIntegral(4, 5, 3)).toEqual(3)
        expect(ii.limitedIntegral(5, 5, 3)).toEqual(0)
        expect(ii.limitedIntegral(5, 6, 3)).toEqual(3)
        expect(ii.limitedIntegral(5, 8, 3)).toEqual(7)
    })
})