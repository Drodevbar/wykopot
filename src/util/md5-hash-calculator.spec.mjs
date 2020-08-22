import { calculateMd5Hash } from "./md5-hash-calculator.mjs";
import chai from 'chai';

const expect = chai.expect;

describe('[util/md5-hash-calculator]', () => {
    describe('calculateMd5Hash function', () => {
        it('should calculate md5 hash when one argument passed', () => {
            const arg = '1';
            const expectedMd5Hash = 'c4ca4238a0b923820dcc509a6f75849b';

            expect(calculateMd5Hash(arg)).to.be.equal(expectedMd5Hash);
        });

        it('should calculate md5 hash when multiple arguments passed', () => {
            const args = ['1', '2', '3'];
            const expectedMd5Hash = '202cb962ac59075b964b07152d234b70';

            expect(calculateMd5Hash(args[0], args[1], args[2])).to.be.equal(expectedMd5Hash);
        });
    })
})