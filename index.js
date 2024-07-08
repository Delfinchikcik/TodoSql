import  express  from "express";
import { Sequelize, DataTypes} from "sequelize";

const app = express();
const port = 3000;

app.use(express.json());

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
  } catch (error) {
    console.error(error);
  }
})();

// Создание юзера Create
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user)
    console.log(`Создан юзер с id: ${user.id}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo)
    console.log(`Создана задача ${todo}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll(req.body);
    res.status(200).json(users)
    console.log(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll(req.body);
    res.status(200).json(todos)
    console.log(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.update(req.body, {
      where: { id: req.params.id }
    });
    if (user) {
      const updatedUser = await User.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'User not found' });
  }
})

app.put('/todos/:id', async (req, res) => {
  try {
    const [todo] = await Todo.update(req.body, {
      where: { id: req.params.id }
    });
    if(todo){
      const updatedTodo = await Todo.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedTodo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(400).json({message: 'Todo not found'})
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.destroy({
      where: {
        id: req.params.id
      },
    });
    if (user) {
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'User not found' });
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.destroy({
      where: {id: req.params.id}
    });
    if (todo){
      res.status(200).json({message: 'todo deleted'})
    } else {
      res.status(404).json({message: 'Todo not found'})
    }
  } catch (error) {
    res.status(400).json({message: 'Todo not found'})
  }
})

app.listen(port, () => {
  console.log(`app запущен на http://localhost:${port}`);
})