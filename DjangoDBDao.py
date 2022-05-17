#coding=utf8
from django.db import connection,transaction,close_old_connections
import logging
logger = logging.getLogger('automation')

class DjangoDBDao(object):

    def insertOrdel(self,sql,param=None):
        '''
        @summary: 对数据进行插入、更新、修改
        @param sql:sql语句
        @param param:sql语句参数，元组/列表
        @return affectCount:  影响的行数
        '''
        affectCount=False
        try:
            self.closeOldConn()
            cursor = connection.cursor()
            affectCount=cursor.execute(sql, param)
        except Exception as e:
            logger.warning('数据库执行sql：{}异常，错误信息为：{}'.format(sql,e))
            raise e
        return affectCount

    def update(self,sql,param=None):
        '''
        @summary: 对数据进行插入、更新、修改
        @param sql:sql语句
        @param param:sql语句参数，元组/列表
        @param commit:True/False默认提交 
        @return affectCount:  影响的行数
        '''
        affectCount=False
        try:
            self.closeOldConn()
            cursor = connection.cursor()
            affectCount=cursor.execute(sql, param)
            transaction.set_autocommit(True)
        except Exception as e:
            logger.warning('数据库执行sql：{}异常，错误信息为：{}'.format(sql,e))
            raise e
        return affectCount

    def getMany(self, sql, num, param=None):
        """
        @summary: 执行查询，并取出num条结果
        @param sql:查询sql，如果有查询条件，请只指定条件列表，并将条件值使用参数[param]传递进来
        @param num:取得的结果条数
        @param param: 可选参数，条件列表值（元组/列表）
        @return: result list/boolean 查询到的结果集
        """
        result = False
        try:
            self.closeOldConn()
            cursor = connection.cursor()
            count = cursor.execute(sql, param)
            if count > 0:
                result = cursor.fetchmany(num)
        except Exception as e:
            logger.warning('数据库执行sql：{}异常，错误信息为：{}'.format(sql,e))
            raise e
        return result

    def getAll(self,sql,param=None):
        """
        @summary: 执行查询，并取出所有结果集
        @param sql:查询sql，如果有查询条件，请只指定条件列表，并将条件值使用参数[param]传递进来
        @param param: 可选参数，条件列表值（元组/列表）
        @return: result list(字典对象)/boolean 查询到的结果集
        """
        result = False
        try:
            self.closeOldConn()
            cursor = connection.cursor()
            count=cursor.execute(sql, param)
            if count>0:
                result=cursor.fetchall() #读取所有
        except Exception as e:
            logger.warning('数据库执行sql：{}异常，错误信息为：{}'.format(sql,e))
            raise e
        return result

    def getOne(self,sql,param=None):
        """
        @summary: 执行查询，并取出第一条
        @param sql:查询sql，如果有查询条件，请只指定条件列表，并将条件值使用参数[param]传递进来
        @param param: 可选参数，条件列表值（元组/列表）
        @return: result list/boolean 查询到的结果集
        """
        result = False
        try:
            self.closeOldConn()
            cursor = connection.cursor()
            count=cursor.execute(sql, param)
            if count>0:
                result=cursor.fetchone() #读取所有
        except Exception as e:
            logger.warning('数据库执行sql：{}异常，错误信息为：{}'.format(sql,e))
            raise e
        return result

    def closeOldConn(self):
        try:
            close_old_connections()
        except Exception:
            pass
