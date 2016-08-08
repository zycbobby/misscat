/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blog_text', {
    text_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    text_content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    text_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    media_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    post_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  }, {
    tableName: 'blog_text',
    timestamps: false
  });
};
