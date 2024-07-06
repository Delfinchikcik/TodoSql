import { text } from "express";
import { Sequelize, DataTypes, where } from "sequelize";

const sequelize = new Sequelize("todo_list", "root", "", {
  host: "MySQL-8.2",
  dialect: "mysql",
});

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

const Todo = sequelize.define(
  "todo",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    tableName: "todos",
  }
);
(async () => {
  try {
    await User.sync({
      alter: true,
      force: false,
    });

    await Todo.sync({
      alter: true,
      force: false,
    });

    if (false) {
      // Создание юзера Create
      const user = await User.create({
        first_name: "Игнат",
        last_name: "Никифоров",
        country: "USA",
        birthday: "1940-04-03",
        email: "Ignat.doe@gmail.com",
        password: "143433456",
      });
      console.log(`Создан юзер с id: ${user.id}`);

      const todo = await Todo.create({
        text: "Learn React",
        done: false,
      });
      console.log(`Создана задача ${todo}`);
    }

    if (false) {
      // Получение юзера Read
      const users = await User.findAll({
        where: {
          country: "USA",
        },
      });
      console.log(users);

      const todos = await Todo.findAll();
      console.log(todos.every(todo => todo instanceof Todo));
      console.log('Все задачи:', JSON.stringify(todos, null, 2));
    }

    if (false) {
      //Обновление данных юзера update
      const user = await User.update(
        { first_name: "Updated" },
        {
          where: {
            first_name: "Игнат",
          },
        }
      );
      console.log(user);
      const todo = await Todo.update(
        { done: true },
        {
          where: {
            text: "Learn React",
          },
        }
      );
      console.log("Изменения внесены");
    }
    if (false) {
      // Удаление юзера Delete
      const user = await User.destroy({
        where: {
          country: "Россия",
        },
      });
      console.log("Пользователь удален");
      const todo = await Todo.destroy(
        {
          where: {
            text: "Learn React",
          },
        }
      );
      console.log("Задача удалена");
    }
  } catch (error) {
    console.error(error);
  }
})();
