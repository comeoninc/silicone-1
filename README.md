# Silicone

```
dragStart('div[data-test-id="origin"]', {})
  .then(() => drop('div[data-test-id="target"]', {}))
  .then(() => waitFor('div[data-test-id="input"]').toHaveClasses('.active'))
  .then(() => type('div[data-test-id="input"]', 'message'))
  .then(() => click('div[data-test-id="submit"]'))
  .then(() => wait(300))
  .then(() => expect(el('div[data-test-id="origin"]').innerHTML.toEqual('done')))

// or

await dragStart('div[data-test-id="origin"]', {})
await drop('div[data-test-id="target"]', {})
await waitFor('div[data-test-id="input"]').toHaveClasses('.active')
await type('div[data-test-id="input"]', 'message')
await click('div[data-test-id="submit"]')
await wait(300)
expect(el('div[data-test-id="origin"]').innerHTML.toEqual('done'))
```
