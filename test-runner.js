// Simple TDD Test Runner for Travel Log
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.currentSuite = null;
    }

    describe(suiteName, testFn) {
        this.currentSuite = suiteName;
        this.currentBeforeEach = null;
        console.log(`\n📦 ${suiteName}`);
        testFn();
        this.currentSuite = null;
        this.currentBeforeEach = null;
    }

    beforeEach(fn) {
        this.currentBeforeEach = fn;
    }

    it(testName, testFn) {
        const fullName = this.currentSuite ? `${this.currentSuite}: ${testName}` : testName;
        this.tests.push({ 
            name: fullName, 
            fn: testFn, 
            beforeEach: this.currentBeforeEach 
        });
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected}, but got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeNull: () => {
                if (actual !== null) {
                    throw new Error(`Expected null, but got ${actual}`);
                }
            },
            toContain: (expected) => {
                if (!actual || !actual.includes || !actual.includes(expected)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} to contain ${expected}`);
                }
            },
            toBeGreaterThan: (expected) => {
                if (actual <= expected) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeLessThan: (expected) => {
                if (actual >= expected) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
            },
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected ${actual} to be falsy`);
                }
            },
            not: {
                toThrow: () => {
                    try {
                        if (typeof actual === 'function') {
                            actual();
                        }
                    } catch (error) {
                        throw new Error(`Expected function not to throw, but it threw: ${error.message}`);
                    }
                }
            }
        };
    }

    async runAll() {
        console.log('🧪 Running TDD Tests for Travel Log\n');
        
        for (const test of this.tests) {
            try {
                // Run beforeEach hook if it exists
                if (test.beforeEach) {
                    await test.beforeEach();
                }
                await test.fn();
                console.log(`✅ ${test.name}`);
                this.results.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}`);
                this.results.failed++;
            }
            this.results.total++;
        }

        console.log('\n📊 Test Results:');
        console.log(`   Total: ${this.results.total}`);
        console.log(`   Passed: ${this.results.passed}`);
        console.log(`   Failed: ${this.results.failed}`);
        
        if (this.results.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log(`❌ ${this.results.failed} test(s) failed`);
        }

        return this.results;
    }
}

// Global test instance
window.testRunner = new TestRunner();
window.describe = (name, fn) => testRunner.describe(name, fn);
window.it = (name, fn) => testRunner.it(name, fn);
window.beforeEach = (fn) => testRunner.beforeEach(fn);
window.expect = (actual) => testRunner.expect(actual);