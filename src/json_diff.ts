const calculate_json_diff = (
  a: { [key: string]: any },
  b: { [key: string]: any }
) => {
  const diff = {}

  // Same, Changed Value, Key Removed
  for (const key of Object.keys(a)) {
    //Removed
    if (!b.hasOwnProperty(key)) {
      diff[key] = {
        change: 'removed',
        old_value: b[key],
      }
    } /* Changed */ else if (a[key] !== b[key]) {
      diff[key] = {
        change: 'changed',
        old_value: a[key],
        new_value: b[key],
      }
    }
  }

  for (const added_key of difference(Object.keys(a), Object.keys(b))) {
    diff[added_key] = {
      change: 'added',
      new_value: b[added_key],
    }
  }

  return diff
}

const difference = (arr1: any[], arr2: any[]) => {
  return arr2.filter((value) => !arr1.includes(value))
}

//TESTING

const testCases = [
  // Example 1: Basic objects with no differences
  {
    name: 'Basic - No Differences',
    before: { name: 'Alice', age: 30 },
    after: { name: 'Alice', age: 30 },
  },
  // Example 2: Basic objects with simple differences
  {
    name: 'Basic - Simple Differences',
    before: { name: 'Bob', city: 'New York' },
    after: { name: 'Robert', city: 'Los Angeles' },
  },
  // Example 3: Objects with added/removed keys
  {
    name: 'Basic - Added/Removed Keys',
    before: { id: 1, status: 'active' },
    after: { id: 1, status: 'inactive', timestamp: '2023-10-27' },
  },
  // Example 4: Nested objects with no differences
  {
    name: 'Nested - No Differences',
    before: {
      user: { firstName: 'Charlie', lastName: 'Brown' },
      permissions: { admin: false, read: true },
    },
    after: {
      user: { firstName: 'Charlie', lastName: 'Brown' },
      permissions: { admin: false, read: true },
    },
  },
  // Example 5: Nested objects with differences in nested values
  {
    name: 'Nested - Differences in Nested Values',
    before: {
      product: { id: 'A123', details: { color: 'red', size: 'M' } },
      price: 100,
    },
    after: {
      product: { id: 'A123', details: { color: 'blue', size: 'L' } },
      price: 100,
    },
  },
  // Example 6: Nested objects with added/removed nested keys
  {
    name: 'Nested - Added/Removed Nested Keys',
    before: { data: { items: [1, 2] }, metadata: { version: 1 } },
    after: {
      data: { items: [1, 2, 3] },
      metadata: { version: 2, source: 'API' },
    },
  },
  // Example 7: Objects with arrays (order matters for simple diff, but good for testing)
  {
    name: 'Arrays - Values Changed',
    before: { tags: ['apple', 'banana'], count: 2 },
    after: { tags: ['banana', 'orange'], count: 3 },
  },
  // Example 8: Complex nested structure with multiple changes
  {
    name: 'Complex - Multiple Changes',
    before: {
      report: {
        title: 'Sales Report',
        sections: [
          { name: 'Summary', data: { total: 500 } },
          { name: 'Details', items: [{ id: 1, value: 10 }] },
        ],
      },
      date: '2023-01-01',
    },
    after: {
      report: {
        title: 'Quarterly Sales',
        sections: [
          { name: 'Summary', data: { total: 600, currency: 'USD' } },
          {
            name: 'Details',
            items: [
              { id: 1, value: 10 },
              { id: 2, value: 20 },
            ],
          },
        ],
      },
      date: '2023-04-01',
      generatedBy: 'System',
    },
  },
]

for (let testCase of testCases) {
  console.log('-----------------------------------')
  console.log(testCase.name)
  console.log(testCase.before)
  console.log(testCase.after)
  console.log(calculate_json_diff(testCase.before, testCase.after))
}
