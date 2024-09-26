> NuGet 
>
> sql server：System.Data.SqlClient
>
> mysql：MySql.Data

#### 连接数据库

>  //连接字符串  SQLServer验证
>  //connection.ConnectionString = "server=.;database=Test;Integrated Security=SSPI";  //Windows验证
>  //connection.DataBase要连接的数据库名称
>  //connection.DataSource   数据源  local  .  Ip，端口号
>  //connection.State   连接的状态
>  //connection.ConnectionTimeout   15s   连接超时

```c#
 //1、创建连接
 //mysql 
 string str = "server=localhost;database=ry-vue;uid=root;pwd=123456";
 //sql server
 string str = "server=.;database=y1;uid=sa;pwd=123456"; 
 try
 {
     using (SqlConnection conn = new SqlConnection(str))
     {
         conn.Open();
         Console.WriteLine("数据库连接成功！");
     }
 }
 catch (Exception ex)
 {

     Console.WriteLine("数据库连接失败！" + ex.Message);
 }
 Console.ReadKey();
```

#### 插入语句 command.ExecuteNonQuery()

> 此处的using和python中的with左右类似
>
> @符号用于防止sql注入

~~~c#
 public static void ssssql(string str)
 {
     try
     {
         // mysql : MySqlConnection
         using (SqlConnection conn = new SqlConnection(str))
         {
             conn.Open();
             string sql = "INSERT INTO db_test_y1.person (id, name, age) VALUES (@PersonalId, @PersonalName, @PersonalAge)";
             // mysql : MySqlCommand
             using (SqlCommand command = new SqlCommand(sql, conn))
             {
                 //使用参数防止sql注入
                 command.Parameters.AddWithValue("@PersonalId", "6");
                 command.Parameters.AddWithValue("@PersonalName", "小红");
                 command.Parameters.AddWithValue("@PersonalAge", "18"); 
                 command.ExecuteNonQuery();
             }
         }
         Console.WriteLine("数据插入成功!");
     }
     catch (Exception ex)
     {
         Console.WriteLine("数据插入失败！" + ex.Message);
     }
     Console.ReadKey();
 }
~~~

#### 查询语句 command.ExecuteReader()

~~~c#
public static void ssssql(string str)
{
    try
    {
        using (SqlConnection conn = new SqlConnection(str))
        {
            conn.Open();
            string sql = "SELECT * FROM db_test_y1.person";
            using (SqlCommand command = new SqlCommand(sql, conn))
            {
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Console.WriteLine($"{reader["id"]} {reader["name"]} {reader["age"]}");
                    }
                }
            }
        }
        Console.WriteLine("数据查询成功!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("数据查询失败！" + ex.Message);
    }
    Console.ReadKey();
}
~~~

#### 删除语句 command.ExecuteNonQuery()

~~~c#
public static void ssssql(string str)
{
    try
    {
        using (SqlConnection conn = new SqlConnection(str))
        {
            conn.Open();
            string sql = "DELETE FROM db_test_y1.person WHERE id='2'";
            using (SqlCommand command = new SqlCommand(sql, conn))
            {
                command.ExecuteNonQuery();
            }
        }
        Console.WriteLine("数据删除成功!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("数据删除失败！" + ex.Message);
    }
    Console.ReadKey();
}
~~~

#### 更新语句

> 和前面三条语句相同

#### 数据处理

### 常用方法

> DataSet
> DataSet是一个数据表的集合，它可以独立于任何数据源存在。它提供了对数据的内存中表示，可以与XML数据集成，并且可以同步到数据源。
>
> DataTable
> DataTable 是 DataSet 中的一个表格型数据结构，代表一个内存中的数据表。它包含了一组 DataRow 对象，这些对象代表表中的行。你可以将 DataTable 当作一个普通的二维表格看待，其中行表示记录，列表示字段。
>
> DataColumn
> DataColumn 对象定义了 DataTable 中的一列。它包含了列的名称、数据类型以及其他属性。你可以通过 DataColumn 对象设置列的默认值、是否可空、是否唯一等属性。
>
> DataRow
> DataRow 对象代表 DataTable 中的一行。你可以通过它来访问或修改这一行的数据。例如，你可以使用 DataRow 对象的索引器来访问特定列的值，或者使用 ItemArray 属性来获取或设置整行的值。

~~~c#
    public static void ssssql(string str)
    {
        try
        { 
            using (SqlConnection conn = new SqlConnection(str))
            {
                conn.Open();
                string sql = "SELECT * FROM db_test_y1.person";
                // 声明数据类型
                DataSet ds = new DataSet(); 
                //创建一个 SqlDataAdapter 对象，它用于填充 DataSet。SqlDataAdapter 负责从数据库中检索数据并将其填充到 DataSet 中。
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sql, conn);
                //使用 SqlDataAdapter 将查询结果填充到 DataSet 中。Fill 方法将数据从数据库加载到 DataSet 的 DataTable 中。
                sqlDataAdapter.Fill(ds);
                //从 DataSet 中获取第一个 DataTable。Tables 属性是 DataSet 中所有表的集合，索引 0 表示第一个表。
                DataTable dt = ds.Tables[0];
                //获取 DataTable 中的第一列（DataColumn 对象）。Columns 属性是 DataTable 中所有列的集合，索引 0 表示第一列。
                DataColumn col = dt.Columns[0];
                //获取 DataTable 中的第一行（DataRow 对象）。Rows 属性是 DataTable 中所有行的集合，索引 0 表示第一行。
                DataRow dr = dt.Rows[0];
                Console.WriteLine(ds.Tables.Count);
                Console.WriteLine($"DataSet对象中第一个表第一行第一列的数据为：" + ds.Tables[0].Rows[0][0]);
                col.ColumnName = "sname1";
                Console.WriteLine($"DataTable对象中第一行第一列的数据为：" + dt.Rows[0][0]);
                Console.WriteLine($"DataColumn对象中第一行的数据为：{col.ColumnName}");
                Console.WriteLine($"DataRow对象中第一行的数据为：{dr[0]}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("出现错误！" + ex.Message);
        }
        Console.ReadKey();
    }
~~~



1. **`AcceptChanges`**

   - 提交所有对 `DataSet` 所有 `DataTable` 的更改。
   - **示例：** `dataSet.AcceptChanges();`

   > **提交更改：**
   >
   > - 当你在 `DataSet` 的 `DataTable` 中对数据进行增、删、改操作时，操作的行会被标记为 `Added`、`Modified` 或 `Deleted`。`AcceptChanges` 方法会将这些标记的状态改为 `Unchanged`，即表示这些修改已经被接受和保存。
   >
   > **重置行状态：**
   >
   > - 在调用 `AcceptChanges` 方法后，所有行的状态将被重置为 `Unchanged`。这意味着 `DataTable` 中的所有行将不再被标记为新增、已修改或已删除。

2. **`Clear`**

   - 删除所有的 `DataTable` 和 `DataRelation`。
   - **示例：** `dataSet.Clear();`

3. **`Clone`**

   - 创建一个新的 `DataSet`，具有相同的结构（架构），但不包含数据。
   - **示例：** `DataSet newDataSet = dataSet.Clone();`

4. **`Copy`**

   - 创建一个完整的 `DataSet` 的副本，包括结构和数据。
   - **示例：** `DataSet copyDataSet = dataSet.Copy();`

5. **`GetXml`**

   - 获取 `DataSet` 的 XML 表示形式（结构和数据）。
   - **示例：** `string xmlData = dataSet.GetXml();`

6. **`ReadXml`**

   - 从 XML 文件或 XML 字符串中填充 `DataSet`。
   - **示例：** `dataSet.ReadXml("data.xml");`

7. **`WriteXml`**

   - 将 `DataSet` 的数据写入 XML 文件或 XML 字符串。
   - **示例：** `dataSet.WriteXml("data.xml");`

8. **`Merge`**

   - 合并另一个 `DataSet` 中的数据到当前 `DataSet` 中。
   - **示例：** `dataSet.Merge(anotherDataSet);`

9. **`RejectChanges`**

   - 撤销所有对 `DataSet` 所有 `DataTable` 的更改。
   - **示例：** `dataSet.RejectChanges();`

10. **`Schema`**

    - 获取或设置 `DataSet` 的架构（结构）。

### 常用属性

1. **`Tables`**

   - 获取 `DataSet` 中的所有 `DataTable` 对象的集合。
   - **示例：** `DataTableCollection tables = dataSet.Tables;`

2. **`Relations`**

   - 获取 `DataSet` 中的所有 `DataRelation` 对象的集合。
   - **示例：** `DataRelationCollection relations = dataSet.Relations;`

   > ### 具体含义
   >
   > 1. **定义数据关系：**
   >    - `DataRelation` 用于表示两个 `DataTable` 之间的关系，例如主表和子表之间的关系。这种关系通常用于定义如何将一个表的数据与另一个表的数据关联起来。
   > 2. **关系集合：**
   >    - `Relations` 属性返回一个 `DataRelationCollection` 对象，这个对象是一个集合，包含了 `DataSet` 中所有定义的 `DataRelation` 对象。
   > 3. **用途：**
   >    - 通过使用 `Relations` 属性，你可以遍历和管理 `DataSet` 中的所有数据关系。这对于处理多表数据关系、进行数据合并、展示关联数据等操作非常有用。

   ~~~c#
   using System;
   using System.Data;
   
   class Program
   {
       static void Main()
       {
           // 创建 DataSet
           DataSet dataSet = new DataSet("MyDataSet");
   
           // 创建父表 DataTable
           DataTable parentTable = new DataTable("Parent");
           parentTable.Columns.Add("ParentID", typeof(int));
           parentTable.Columns.Add("ParentName", typeof(string));
           parentTable.Rows.Add(1, "Parent1");
           parentTable.Rows.Add(2, "Parent2");
   
           // 创建子表 DataTable
           DataTable childTable = new DataTable("Child");
           childTable.Columns.Add("ChildID", typeof(int));
           childTable.Columns.Add("ParentID", typeof(int));
           childTable.Columns.Add("ChildName", typeof(string));
           childTable.Rows.Add(1, 1, "Child1");
           childTable.Rows.Add(2, 1, "Child2");
           childTable.Rows.Add(3, 2, "Child3");
   
           // 将 DataTable 添加到 DataSet
           dataSet.Tables.Add(parentTable);
           dataSet.Tables.Add(childTable);
   
           // 创建数据关系
           DataRelation relation = new DataRelation(
               "ParentChildRelation",
               parentTable.Columns["ParentID"],
               childTable.Columns["ParentID"]
           );
   
           // 将关系添加到 DataSet
           dataSet.Relations.Add(relation);
   
           // 获取关系集合
           DataRelationCollection relations = dataSet.Relations;
   
           // 遍历和显示所有关系
           foreach (DataRelation rel in relations)
           {
               Console.WriteLine($"Relation Name: {rel.RelationName}");
               Console.WriteLine($"Parent Table: {rel.ParentTable.TableName}");
               Console.WriteLine($"Child Table: {rel.ChildTable.TableName}");
           }
       }
   }
   ~~~

   

3. **`DataSetName`**

   - 获取或设置 `DataSet` 的名称。
   - **示例：** `string name = dataSet.DataSetName;`

4. **`Namespace`**

   - 获取或设置 `DataSet` 的 XML 命名空间。
   - **示例：** `string xmlNamespace = dataSet.Namespace;`

5. **`HasErrors`**

   - 获取一个值，该值指示 `DataSet` 是否包含任何 `DataTable` 错误。
   - **示例：** `bool hasErrors = dataSet.HasErrors;`

6. **`Tables.Count`**

   - 获取 `DataSet` 中的 `DataTable` 数量。
   - **示例：** `int tableCount = dataSet.Tables.Count;`

7. **`Tables["TableName"]`**

   - 通过名称获取 `DataTable`。
   - **示例：** `DataTable table = dataSet.Tables["TableName"];`

### 数据绑定

将DataSet中的数据绑定到UI控件上，实现数据的展示和编辑。（后期写到winform开发会详细写）

### 事务处理

在ADO.NET中使用事务的方法，确保数据的一致性和完整性。

~~~c#
 public static void ssssql(string str)
 {
     try
     {
         using (SqlConnection conn = new SqlConnection(str))
         {
             conn.Open();
             SqlTransaction transaction = null;
             try
             {
                 // 开始事务  
                 transaction = conn.BeginTransaction("SampleTransaction");
                 // 创建命令对象并关联事务  
                 using (SqlCommand command = conn.CreateCommand())
                 {
                     command.Transaction = transaction;
                     command.CommandText = "INSERT INTO db_test_y1.person (id, name, age) VALUES ('9', '兔子', '6')"; // 示例INSERT语句  
                     command.ExecuteNonQuery(); // 执行命令  
                 }
                 // 如果这里没有发生异常，则提交事务  
                 transaction.Commit(); // 提交事务使更改生效到数据库中  
                 Console.WriteLine("事务提交成功！");
             }
             catch (Exception ex)
             {
                 Console.WriteLine("Error: " + ex.Message);
                 if (transaction != null) // 如果存在事务，则回滚更改  
                 {
                     transaction.Rollback(); // 回滚事务撤销所有更改  
                 }
             }
         }
     }
     catch (Exception ex)
     {
         Console.WriteLine("出现错误！" + ex.Message);
     }
     Console.ReadKey();
 }
~~~

### 与XML集成

如何将DataSet转换为XML格式，以及如何从XML加载数据到DataSet中。

~~~c#
try
{
    using (SqlConnection conn = new SqlConnection(str))
    {
        conn.Open();
        string sql = "SELECT * FROM Student";
        DataSet ds = new DataSet();
        SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sql, conn);
        sqlDataAdapter.Fill(ds);
        //DataSet转化为xml
        ds.WriteXml("output.xml");
        Console.WriteLine("output.xml转化成功!");
        //xml转化为DataSet
        // 创建一个新的DataSet对象  
        DataSet dataSet = new DataSet();
        // 从XML文件加载数据到DataSet中  
        dataSet.ReadXml("input.xml");
        for (int i = 0; i<dataSet.Tables[0].Rows.Count; i++)
        {
            Console.WriteLine($"{dataSet.Tables[0].Rows[i][0]} {dataSet.Tables[0].Rows[i][1]} {dataSet.Tables[0].Rows[i][2]} {dataSet.Tables[0].Rows[i][3]}");
        }
    }
    Console.WriteLine("转化成功!");
}
catch (Exception ex)
{
    Console.WriteLine("转化失败！" + ex.Message);
}
Console.ReadKey();
~~~

