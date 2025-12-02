module.exports = (sequelize, DataTypes) => {
  const Mark = sequelize.define('Mark', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id',
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'subject_id',
    },
    marks: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'marks',
    timestamps: false,
  });

  Mark.associate = (models) => {
    Mark.belongsTo(models.Student, {
      foreignKey: 'studentId',
      onDelete: 'CASCADE',
    });
    Mark.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      onDelete: 'CASCADE',
    });
  };

  return Mark;
};
 