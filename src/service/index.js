const rep = require('../repository');

const normalize = callback => {
  rep.initialize();
  return rep
    .selectAllTags()
    .then(tags => {
      console.log(`${tags.length} abnormal tags are detected.`);
      const tagList = tags
        .map(tag => {
          const tagName = tag.name;
          const newTag = tagName.replace(/_/g, ' ').trim();

          if (tagName === newTag) {
            return null;
          }
          return { ...tag, tagName: newTag };
        })
        .filter(tag => !!tag);

      return Promise.all(tagList.map(tag => rep.selectSingleTag(tag.tagName)))
        .then(result =>
          Promise.all(
            result.map((tag, index) => {
              const t = tagList[index];
              if (
                tag &&
                tag.name[0] !== ' ' &&
                tag.name[tag.name.length - 1] !== ' '
              ) {
                console.log(
                  `Update Posts_Tags relations: ${t.id} -> ${tag.id}.`
                );
                return rep.updatePostTag(t.id, tag.id).then(() => tag.id);
              }
              console.log(`Update a Tag: '${t.name}' -> '${t.tagName}'.`);
              return rep
                .updateSingleTag(t.id, t.tagName)
                .then(() => t.id)
                .catch(e => {
                  if (e.code === 'ER_DUP_ENTRY') {
                    console.error(e.message);
                  } else {
                    console.error(e);
                  }
                  errorCount++;
                  return null;
                });
            })
          )
        )
        .then(ids => {
          const tagIds = ids.filter(id => !!id);
          console.log(`${tagIds.length} tags are normalized.`);
          return Promise.all(tagIds.map(id => rep.selectPostIdsByTagId(id)));
        })
        .then(result => {
          const ids = result
            .filter(postIds => !!postIds)
            .reduce((prev, postIds) => {
              return [...prev, ...postIds];
            }, []);
          const updatedPostIds = Array.from(new Set(ids));
          if (updatedPostIds.length > 0) {
            console.log(`Update ${updatedPostIds.length} posts.`);
            return rep.updatePostLastUpdated(updatedPostIds);
          }
          return Promise.resolve();
        })
        .catch(error => {
          console.error(error);
          rep.terminate();
          callback(error);
        });
    })
    .then(() => {
      return rep.deleteOrphanTags();
    })
    .then(result => {
      if (result.affectedRows > 0) {
        console.log(`${result.affectedRows} orphan tags are deleted.`);
      }
      return Promise.resolve();
    })
    .then(() => {
      rep.terminate();
      callback();
    })
    .catch(error => {
      console.error(error);
      rep.terminate();
      callback(error);
    });
};

module.exports = {
  normalize,
};
