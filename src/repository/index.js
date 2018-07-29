const mysql = require('mysql2/promise');
const dbConfig = require('../mysqlConfig');
const {
  SELECT_ALL_TAGS,
  SELECT_SINGLE_TAG_BY_NAME,
  SELECT_POST_IDS_BY_TAG_ID,
  UPDATE_POSTS_TAGS,
  UPDATE_SINGLE_TAG,
  UPDATE_POST_LAST_UPDATED,
  DELETE_ORPHAN_TAGS,
} = require('./namedQueries');

module.exports = (() => {
  let pool = null;

  const executeQuery = (sqlQuery, args = null) =>
    pool
      .getConnection()
      .then(conn => {
        const result = conn.execute(sqlQuery, args);
        conn.release();
        return result;
      })
      .then(result => result[0]);

  const initialize = () => {
    pool = mysql.createPool(dbConfig);
    console.log('Initialize DB connection pool.');
  };

  const selectAllTags = () => executeQuery(SELECT_ALL_TAGS);

  const selectSingleTag = tagName =>
    executeQuery(SELECT_SINGLE_TAG_BY_NAME, [tagName]).then(
      result => (result.length > 0 ? result[0] : null)
    );

  const selectPostIdsByTagId = tagId =>
    executeQuery(SELECT_POST_IDS_BY_TAG_ID, [tagId]).then(
      result => (result.length > 0 ? result.map(row => row.postId) : null)
    );

  const updatePostTag = (tagId, newTagId) =>
    executeQuery(UPDATE_POSTS_TAGS, [newTagId, tagId]);

  const updateSingleTag = (tagId, tagName) =>
    executeQuery(UPDATE_SINGLE_TAG, [tagName, tagId]);

  const updatePostLastUpdated = postIds =>
    executeQuery(UPDATE_POST_LAST_UPDATED, [postIds]);

  const deleteOrphanTags = () => executeQuery(DELETE_ORPHAN_TAGS);

  const terminate = () => {
    console.log('Terminate DB connection pool.');
    return pool.end();
  };

  return {
    initialize,
    terminate,
    selectAllTags,
    selectSingleTag,
    updatePostTag,
    updateSingleTag,
    updatePostLastUpdated,
    selectPostIdsByTagId,
    deleteOrphanTags,
  };
})();
