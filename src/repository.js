const mysql = require('mysql');
const config = require('./config');
const {
  SELECT_ALL_TAGS,
  SELECT_SINGLE_TAG_BY_NAME,
  SELECT_POST_IDS_BY_TAG_IDS,
  UPDATE_POSTS_TAGS,
  UPDATE_SINGLE_TAG,
  UPDATE_POST_LAST_UPDATED,
  DELETE_ORPHAN_TAGS,
} = require('./namedQueries');

module.exports = (() => {
  let pool = null;

  const executeQuery = (sqlQuery, args = null) => {
    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, args, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  };

  const initialize = () => {
    if (!pool || !pool.getConnection) {
      pool = mysql.createPool(config.db);
    }
  };

  const selectAllTags = () => executeQuery(SELECT_ALL_TAGS);

  const selectSingleTag = tagName => {
    return executeQuery(SELECT_SINGLE_TAG_BY_NAME, [tagName]).then(
      result => (result.length > 0 ? result[0] : null)
    );
  };

  const selectPostIdsByTagIds = tagIds => {
    return executeQuery(SELECT_POST_IDS_BY_TAG_IDS, [tagIds]).then(result => {
      return result.length > 0 ? result.map(row => row.postId) : [];
    });
  };

  const updatePostTag = (tagId, newTagId) => {
    return executeQuery(UPDATE_POSTS_TAGS, [newTagId, tagId]);
  };

  const updateSingleTag = (tagId, tagName) => {
    return executeQuery(UPDATE_SINGLE_TAG, [tagName, tagId]);
  };

  const updatePostsLastUpdated = postIds => {
    return executeQuery(UPDATE_POST_LAST_UPDATED, [postIds]);
  };

  const deleteOrphanTags = () => {
    return executeQuery(DELETE_ORPHAN_TAGS).then(result => result.affectedRows);
  };

  const terminate = () => {
    if (pool && pool.end) {
      pool.end();
    }
  };

  return {
    initialize,
    terminate,
    selectAllTags,
    selectSingleTag,
    updatePostTag,
    updateSingleTag,
    updatePostsLastUpdated,
    selectPostIdsByTagIds,
    deleteOrphanTags,
  };
})();
