export class IntegratedIntervals {

    private intervals: Interval[] = []
    
    add(beg: number, end: number, val: number) {
        if (this.intervals.length == 0) {
            this.intervals.push(new Interval(beg, end, 0))
        } else {
            if (beg < this.intervals[0].beg) {
                this.intervals.unshift(new Interval(beg, this.intervals[0].beg, 0))
            }
            if (this.intervals[this.intervals.length - 1].end < end) {
                this.intervals.push(new Interval(this.intervals[this.intervals.length - 1].end, end, 0))
            } 
        }
        let {begIndex, endIndex} = this.adjustIntervalsToNewInterval(beg, end)
        this.addValue(begIndex, endIndex, val)
        this.fixIntervals(begIndex, endIndex)
    }

    sum(x: number): number {
        let sum = 0
        this.intervals.forEach(element => {
            if (element.contains(x)) {
                sum = element.sum
            }
        });
        return sum
    }

    intergral(beg: number, end: number): number {
        return this.getSum(beg, end, int => int.integral())
    }

    limitedIntegral(beg: number, end: number, limit: number): number {
        return this.getSum(beg, end, int => int.limitedIntegral(limit))
    }

    private getSum(beg: number, end: number, summingFn: (interval: Interval) => number): number {
        let sum = 0
        if (this.intervals.length > 0) {
            beg = Math.max(beg, this.intervals[0].beg)
            end = Math.min(end, this.intervals[this.intervals.length - 1].end)
            if (beg < end) {
                let {begIndex, endIndex} = this.adjustIntervalsToNewInterval(beg, end)
                for (let index = begIndex; index <= endIndex; index++) {
                    sum += summingFn(this.intervals[index]);
                }
                this.fixIntervals(begIndex, endIndex)
            }
        }
        return sum
    }

    private adjustIntervalsToNewInterval(beg: number, end: number): {begIndex: number, endIndex: number} {
        let begFound = false
        let begIndex: number
        let endIndex: number
        for (let index = 0; index < this.intervals.length; index++) {
            let interval = this.intervals[index];
            if (!begFound && interval.contains(beg)) {
                begIndex = index
                if (beg > interval.beg) {
                    this.intervals.splice(index + 1, 0, new Interval(beg, interval.end, interval.sum))
                    interval.end = beg
                    begFound = true
                    begIndex = index + 1
                }
            }
            if (interval.beg < end && end <= interval.end) {
                endIndex = index
                if (end < interval.end) {
                    this.intervals.splice(index + 1, 0, new Interval(end, interval.end, interval.sum))
                    interval.end = end
                }
                return {begIndex: begIndex, endIndex: endIndex}
            }
        }
        throw new Error('Illegal state error!')
    }

    private addValue(begIndex: number, endIndex: number, val: number) {
        for (let i = begIndex; i <= endIndex; i++) {
            this.intervals[i].sum += val
        }
    }

    private fixIntervals(begIndex: number, endIndex: number) {
        this.fixInterval(endIndex)
        this.fixInterval(begIndex)
    }

    private fixInterval(index: number) {
        if (index < this.intervals.length - 1 && this.intervals[index + 1].sum == this.intervals[index].sum) {
            this.intervals[index].end = this.intervals[index + 1].end
            this.intervals.splice(index + 1, 1)
        }
        if (index < this.intervals.length - 1 && index > 0 && this.intervals[index - 1].sum == this.intervals[index].sum) {
            this.intervals[index - 1].end = this.intervals[index].end
            this.intervals.splice(index, 1)
        } 
    }

    toString(): string {
        return `[${this.intervals.map(i => i.toString()).join(' ')}]`
    }
}

class Interval {

    constructor(
        public beg: number,
        public end: number,
        public sum: number
    ) {}

    limitedIntegral(limit: number) {
        return Math.min(limit, this.sum) * this.length()
    }

    integral(): number {
        return this.sum * this.length()
    }

    length(): number {
        return this.end - this.beg
    }

    contains(x: number): boolean {
        return x >= this.beg && x < this.end
    }

    toString() {
        return `(${this.beg}, ${this.end}; ${this.sum})`
    }
}