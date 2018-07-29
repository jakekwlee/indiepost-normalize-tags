module.exports = {
  SELECT_ALL_TAGS:
    "select t.id, t.name  from Tags t inner join Posts_Tags pt on pt.tagId = t.id where t.name regexp '[_]+' or name regexp ' $' group by t.id order by t.id",
  SELECT_SINGLE_TAG_BY_NAME: 'select * from Tags where name = ?',
  SELECT_POST_IDS_BY_TAG_ID:
    'select distinct postId from Posts_Tags where tagId = ?',
  UPDATE_POSTS_TAGS:
    'update Posts_Tags set tagId = ? where tagId = ? and id > 0',
  UPDATE_POST_LAST_UPDATED:
    'update Posts set modifiedAt = now(), editorId = 1 where id in (?)',
  UPDATE_SINGLE_TAG: 'update Tags set name = ? where id = ?',
  DELETE_ORPHAN_TAGS:
    ' delete t from Tags t left outer join Posts_Tags pt on pt.tagId = t.id where t.id > 0 and pt.tagId is null',
};
