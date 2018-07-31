const repository = require('../src/repository');

describe('Repository', () => {
  beforeAll(() => {
    repository.initialize();
  });

  it('selectAllTags() should return array of tags properly', async () => {
    const tags = await repository.selectAllTags();
    expect(tags).not.toBeNull();
    expect(Array.isArray(tags)).toBeTruthy();
  });

  it('selectSingleTag() should return array of tags properly', async () => {
    const tagName = '스티브 부세미';
    const tag = await repository.selectSingleTag(tagName);
    expect(tag).not.toBeNull();
    expect(tag).toHaveProperty('id');
    expect(tag).toHaveProperty('name', tagName);
  });

  it('selectPostIdsByTagIds() should return array of tags properly', async () => {
    const tagIds = [400, 2244];
    return repository.selectPostIdsByTagIds(tagIds).then(postIds => {
      expect(postIds).not.toBeNull();
      expect(postIds.length).toBeGreaterThan(tagIds.length);
    });
  });

  afterAll(repository.terminate);
});
