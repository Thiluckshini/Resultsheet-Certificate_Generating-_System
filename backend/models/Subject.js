module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('Subject', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      institute: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course: {
        type: DataTypes.STRING, // <-- Add this
        allowNull: false,
      },
      semester: {
        type: DataTypes.INTEGER, // <-- And this
        allowNull: false,
      },
    }, {
      tableName: 'subjects',
      timestamps: true,
    });
  
    return Subject;
  };
  