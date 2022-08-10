import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.model.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      username: req.body.username,
      avatarUrl: req.body.avatarUrl,

      email: req.body.email,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({
        status: 'error',
        error,
        message: 'Неверный логин или пароль',
      });

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass)
      return res.status(400).json({
        status: 'error',
        error,
        message: 'Неверный логин или пароль',
      });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      status: 'success',
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
      message: 'Нет доступа',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await UserModel.find().select('-passwordHash').exec();

    res.json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const userId = req.params.id;

    UserModel.findOne(
      {
        _id: userId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть пользователя',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Пользователь не найден',
          });
        }

        const { passwordHash, ...userData } = doc._doc;

        res.json({
          status: 'success',
          data: userData,
        });
      }
    );
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
