/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blog_comment', {
    comment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    text_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    comment_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  }, {
    tableName: 'blog_comment',
    timestamps: false
  });
};
