import { keyPath } from '../src/keyPath'

const target = {
  p1: 'test1',
  p2: {
    p21: 'test2',
    p22: {
      p221: 221,
      p222: 'test3'
    }
  }
}

test("evaluate keyPath returns existing values", () => {
  expect(keyPath('p1', target)).toBe('test1')
  expect(keyPath('p2', target)).toEqual(target.p2)
  expect(keyPath('p2.p21', target)).toBe('test2')
  expect(keyPath('p2.p22', target)).toEqual(target.p2.p22)
  expect(keyPath('p2.p22.p221', target)).toBe(221)
  expect(keyPath('p2.p22.p222', target)).toBe('test3')
})

test("evaluate keyPath returns undefined where path does not exist", () => {
  expect(keyPath('p3', target)).toBe(undefined)
  expect(keyPath('p1.p3', target)).toBe(undefined)
  expect(keyPath('p1.p3.p6', target)).toBe(undefined)
  expect(keyPath('p1', undefined)).toBe(undefined)
})

test("set keyPath sets values on existing objects", () => {
  var target = { o1: {} }
  keyPath.set('p1', target, 1)
  keyPath.set('o1.p2', target, 2)
  expect(target.p1).toBe(1)
  expect(target.o1.p2).toBe(2)
})

test("set keyPath creates object path", () => {
  var target = {}
  keyPath.set('o1.p1', target, 1)
  expect(target.o1.p1).toBe(1)
})

test("set keyPath overwrites existing values", () => {
  var target = { p1: 1, p2: true, o1: { p4: 2 } }
  keyPath.set('p1', target, 3)
  keyPath.set('p2.p3', target, 3)
  keyPath.set('o1.p4', target, 4)
  expect(target.p1).toBe(3)
  expect(target.p2.p3).toBe(3)
  expect(target.o1.p4).toBe(4)
})
