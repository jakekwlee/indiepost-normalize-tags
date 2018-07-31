const repository = require('./repository');
const { uniqueFlatten, trimAndRemoveUnderscore } = require('./utils');

const normalize = callback => {
  repository.initialize();

  return repository
    .selectAllTags()
    .then(tags => {
      console.log(`${tags.length} abnormal tags are detected.`);
      if (tags.length === 0) {
        // no abnormal tags, exit process immediately
        repository.terminate();
        callback();
      }
      return tags.map(tag => ({
        ...tag,
        tagName: trimAndRemoveUnderscore(tag.name),
      }));
    })
    .then(tags => {
      return Promise.all([tags, ...tags.map(tag => repository.selectSingleTag(tag.tagName))]);
    })
    .then(result => {
      const [fixedOldTagList, ...indices] = result;
      return Promise.all(
        indices.map((tag, index) => {
          const fixedTag = fixedOldTagList[index];
          if (tag && tag.name[0] !== ' ' && tag.name[tag.name.length - 1] !== ' ') {
            console.log(`Update Posts_Tags relation: ${fixedTag.id} -> ${tag.id}.`);
            return repository.updatePostTag(fixedTag.id, tag.id).then(() => tag.id);
          }
          console.log(`Update a Tag: '${fixedTag.name}' -> '${fixedTag.tagName}'.`);
          return repository
            .updateSingleTag(fixedTag.id, fixedTag.tagName)
            .then(() => fixedTag.id)
            .catch(e => {
              if (e.code === 'ER_DUP_ENTRY') {
                console.error(e.message);
              } else {
                console.error(e);
              }
              return Promise.resolve();
            });
        })
      );
    })
    .then(ids => {
      const tagIds = ids.filter(id => !!id);
      console.log(`${tagIds.length} tags are normalized.`);
      return repository.selectPostIdsByTagIds(tagIds);
    })
    .then(result => {
      const postIds = uniqueFlatten(result);
      if (postIds.length > 0) {
        console.log(`Update ${postIds.length} posts.`);
        return repository.updatePostsLastUpdated(postIds);
      }
      return Promise.resolve();
    })
    .then(() => repository.deleteOrphanTags())
    .then(affectedRows => {
      if (affectedRows > 0) {
        console.log(`${affectedRows} orphan tags are deleted.`);
      }
      return Promise.resolve();
    })
    .then(() => {
      repository.terminate();
      callback();
    })
    .catch(error => {
      console.error(error);
      repository.terminate();
      callback(error);
    });
};

module.exports = {
  normalize,
};
