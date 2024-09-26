### 元信息定义

元信息：一般是用来描述项目的数据，比如项目的名称、作者等。  

比如第一阶段项目 `MainGenerator` 类中的动态文件路径，就是在代码中“写死”的，这并不优雅。 

#### 元信息的存储结构 

此处我们选用 JSON 格式来存储元信息，理由是常用、通用、结构清晰、便于理解、对前端 JavaScript 非常友好。

将元信息文件定义为 `meta.json、application.yml `    ，之后放在制作工具项目的 `resources` 目录下。

#### 示例配置信息

就以我们上面新建的 `acm-template-pro` 项目为例，来编写一个生成该项目的代码生成器的元信息配置 JSON 文件。

示例代码如下，大家可以先不用理解这些配置，后面会陆续讲解：

```json
{
    "name": "acm-template-pro-generator",
    "description": "ACM 示例模板生成器",
    "basePackage": "com.yupi",
    "version": "1.0",
    "author": "yupi",
    "createTime": "2023-11-22",
    "fileConfig": {
        "inputRootPath": "/Users/yupi/Code/yuzi-generator/yuzi-generator-demo-projects/acm-template-pro",
        "outputRootPath": "generated",
        "type": "dir",
        "files": [
          {
            "inputPath": "src/com/yupi/acm/MainTemplate.java.ftl",
            "outputPath": "src/com/yupi/acm/MainTemplate.java",
            "type": "file",
            "generateType": "dynamic"
          },
          {
            "inputPath": ".gitignore",
            "outputPath": ".gitignore",
            "type": "file",
            "generateType": "static"
          },
          {
            "inputPath": "README.md",
            "outputPath": "README.md",
            "type": "file",
            "generateType": "static"
          }
        ]
    },
    "modelConfig": {
      "models": [
        {
          "fieldName": "loop",
          "type": "boolean",
          "description": "是否生成循环",
          "defaultValue": false,
          "abbr": "l"
        },
        {
          "fieldName": "author",
          "type": "String",
          "description": "作者注释",
          "defaultValue": "yupi",
          "abbr": "a"
        },
        {
          "fieldName": "outputText",
          "type": "String",
          "description": "输出信息",
          "defaultValue": "sum = ",
          "abbr": "o"
        }
      ]
    }
} 
```

注意，和设计库表一样，能提前确认的字段就提前确认，之后尽量只新增字段、避免修改字段。

后面随着制作工具的能力增强，元信息的配置肯定会越来越多。为此，建议在外层尽量用对象来组织字段，而不是数组。在不确定信息的情况下，这么做更有利于字段的扩展。

## 三、代码生成器制作工具开发 

开发顺序遵循上面需求分析中提到的代码生成器制作步骤，分为：

1. 项目初始化
2. 读取元信息
3. 生成数据模型文件
4. 生成 Picocli 命令类
5. 生成代码生成文件
6. 程序构建 jar 包
7. 程序封装脚本
8. 测试验证

下面依次实现： 

### 1、maker 项目初始化

首先在项目根目录 `yuzi-generator` 下新建一个代码生成器制作工具项目 `yuzi-generator-maker`。这次我们不用 IDEA 新建了，直接复制 `yuzi-generator-basic` 项目然后改名即可，这样可以复用之前的生成代码和 pom.xml 依赖文件。

复制完项目后，我们用 IDEA 单独打开 `yuzi-generator-maker` 项目：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/6935c2b5-73a0-43d1-9340-ae3288b86bfc.png)

在该项目内全局替换 `yuzi-generator-basic` 为 `yuzi-generator-maker`：

![img](https://pic.code-nav.cn/post_picture/1610518142000300034/b284cbce-223c-48db-985c-d2786c9bebb6.png)

然后将项目的根包由 `com.yupi` 改为 `com.yupi.maker`，防止可能的多项目间冲突。

直接选中 `com.yupi` 包，按 `Shift + F6` 就能快速重构包路径了：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/28bf75ca-dc3c-4582-a651-7bdbf7f76b13.png) 

接下来，我们可以完整阅读一遍当前项目代码，对其中的部分代码和目录结构进行优化。

#### 代码和目录结构优化

1）重命名 `MainTemplateConfig.java` 文件为 `DataModel.java`

修改名称是为了后面生成数据模型文件时，显得更通用，做到见名知意。

直接选中 `MainTemplateConfig` 文件，按 `Shift + F6` 就能快速重命名了：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/90c6c6f4-5bc6-4098-95f0-a1d2c47c46f2.png) 

2）优化 `DynamicGenerator.java`

包括移除 Main 方法和多余的注释、补充文件不存在则创建文件和父目录的逻辑。

然后将文件名改为 `DynamicFileGenerator`，使语义更明确。 

完整代码如下：

```java
package com.yupi.maker.generator;
        
        import cn.hutool.core.io.FileUtil;
        import freemarker.template.Configuration;
        import freemarker.template.Template;
        import freemarker.template.TemplateException;
        
        import java.io.File;
        import java.io.FileWriter;
        import java.io.IOException;
        import java.io.Writer;
        
        /**
         * 动态文件生成
         */
        public class DynamicFileGenerator {
        
            /**
             * 生成文件
             * 
             * @param inputPath 模板文件输入路径
             * @param outputPath 输出路径
             * @param model 数据模型
             * @throws IOException
             * @throws TemplateException
             */
            public static void doGenerate(String inputPath, String outputPath, Object model) throws IOException, TemplateException {
                // new 出 Configuration 对象，参数为 FreeMarker 版本号
                Configuration configuration = new Configuration(Configuration.VERSION_2_3_32);
        
                // 指定模板文件所在的路径
                File templateDir = new File(inputPath).getParentFile();
                configuration.setDirectoryForTemplateLoading(templateDir);
        
                // 设置模板文件使用的字符集
                configuration.setDefaultEncoding("utf-8");
        
                // 创建模板对象，加载指定模板
                String templateName = new File(inputPath).getName();
                Template template = configuration.getTemplate(templateName);
        
                // 文件不存在则创建文件和父目录
                if (!FileUtil.exist(outputPath)) {
                    FileUtil.touch(outputPath);
                }
        
                // 生成
                Writer out = new FileWriter(outputPath);
                template.process(model, out);
        
                // 生成文件后别忘了关闭哦
                out.close();
            }
        
        } 
```

3）优化 `StaticGenerator. `

为了保证后续的代码生成不出错，尽量不要用自己写的递归方法，只保留 `copyFilesByHutool` 方法，移除其他代码。

然后将文件名改为 `StaticFileGenerator`，使语义更明确。

完整代码如下： 

```java
package com.yupi.maker.generator;
        
        import cn.hutool.core.io.FileUtil;
        
        /**
         * 静态文件生成
         */
        public class StaticFileGenerator {
        
            /**
             * 拷贝文件（Hutool 实现，会将输入目录完整拷贝到输出目录下）
             *
             * @param inputPath
             * @param outputPath
             */
            public static void copyFilesByHutool(String inputPath, String outputPath) {
                FileUtil.copy(inputPath, outputPath, false);
            }
        } 
```

4）优化 `MainGenerator.java`，将生成静态文件调用的方法修改为 `copyFilesByHutool`

修改代码如下： 

```java
// 生成静态文件
StaticGenerator.copyFilesByHutool(inputPath, outputPath); 
```

然后将文件名改为 `FileGenerator`，使语义更明确。

5）将生成文件相关的类都从 `maker.generator` 包移动到 `maker.generator.file` 包下，防止和后面的其他生成器混在一起。 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/831417ca-1cc5-466d-ac7b-1cf41cad88f3.png)

6）删除多余的无用代码，比如：

- 删除 `.gitignore` 文件，统一在项目根目录管理 git 文件。
- 删除现有的 FTL 模板文件
- 删除单元测试文件
- 删除所有制作好的脚本文件等

得到的目录结构如下：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/0cfa2cda-d0fd-470a-8d9d-ce5cdbfdbf6e.png)

#### 生成文件目录结构化 

我们要使用 maker 项目来制作代码生成器，也就是说需要生成一个完整的项目（类似 `yuzi-generator-basic`），那么必然需要用到很多模板文件。

为了更清晰直观地管理这些模板文件，可以仿照 `yuzi-generator-basic` 项目，在 `resources` 目录下新建相似的目录结构，如下图：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/16ab85b0-1a6b-46f4-80b1-00741a221fd6.png) 

其中，static 目录用于存放可以直接拷贝的静态文件。

之后，可以把对应的模板文件放到对应的包下，和原项目的文件位置一一对应，便于理解和管理。

### 2、读取元信息 

#### 元信息定义

在上面的内容中，已经给大家提供了一个较为完整的元信息配置文件。我们将该文件 `meta.json` 存放到 maker 项目的 `resources` 目录下。

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/986d3900-ea51-47fc-a5d5-e91ac0a1fec9.png) 

此处我们先来讲解最基础的元信息配置，主要包含下面这些字段：

```json
{
          "name": "acm-template-pro-generator",
          "description": "ACM 示例模板生成器",
          "basePackage": "com.yupi",
          "version": "1.0",
          "author": "yupi",
          "createTime": "2023-11-22",
          "fileConfig": {
            ...
          },
          "modelConfig": {
            ...
          }
        } 
```

分别解释： 

- name：代码生成器名称，项目的唯一标识
- description：生成器的描述
- basePackage：控制生成代码的基础包名 
- version：生成器的版本号，会影响 Maven 的 pom.xml 文件，从而影响 Jar 包的名称
- author：作者名称
- createTime：创建时间 
- fileConfig：是一个对象，用于控制文件的生成配置
- modelConfig：是一个对象，用于控制数据模型（动态参数）信息

下面我们要编写代码，在 Java 程序中方便地读取到这个配置文件并转换为 Java 对象。

#### 元信息模型类 

在 `maker.meta` 包下新建 `Meta` 类，用于接受 JSON 字段。

但是有个问题，JSON 配置文件如果比较复杂，`Meta` 类的所有字段都要我们手动一个个地去编写代码么？

当然不是，我们可以使用一些 JSON 文件转 Java 类代码的 IDEA 插件，比如： 

- GsonFormatPlus
- oboPOJOGenerator
- Json2Pojo 

这几个插件鱼皮都是用过的，最推荐的还是 GsonFormatPlus。

首先在 IDEA 插件中搜索并安装： 

![img](https://pic.code-nav.cn/post_picture/1610518142000300034/d27c6c6d-d7b8-4916-9314-3efd021c0e6b.png)

然后打开 `Meta` 文件，按 `Alt + Insert` 键打开生成器菜单，选择 `GsonFormatPlus`：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/be42bf4f-db21-46f1-804e-f2117221f95c.png) 

然后将完整的 `meta.json` 复制到左侧窗口：

![img](https://pic.code-nav.cn/post_picture/1610518142000300034/d1a20459-d04d-421a-a195-eadd7f8e5c10.png)

点击左下角的 `Setting` 按钮，弹出高级配置，按照下图的规则配置： 

![img](https://pic.code-nav.cn/post_picture/1610518142000300034/0aee68ab-c126-4b3b-84a5-6d0d6b82b3d9.png)

然后就为 `Meta` 类自动填充了属性信息，如下图：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/b2e50c85-1a7d-47bc-afe9-64a13f918b57.png) 

自动生成代码后，我们一定要人工校验，防止出现细节问题。

此处我们要做几个小改动：

1. 将 `Files` 改名为 `FileInfo`。复数变单数，更好理解

2. 将 `Models` 改名为 `ModelInfo`

3. 修改 `ModelInfo.defaultValue` 的类型为 `Object`，同时兼容多种不同的类型


#### 读取元信息 - 单例模式

有了实体类后，如何将 JSON 的值填充到实体对象呢？

很简单，先读取到资源目录下的元信息文件，然后使用 Hutool 的 `JSONUtil.toBean` 方法，就能将 JSON 字符串转为对象了。 

示例代码如下：

```java
String metaJson = ResourceUtil.readUtf8Str("meta.json");
Meta newMeta = JSONUtil.toBean(metaJson, Meta.class); 
```

但是我们每次想获取对象时，都要重复执行这些操作么？ 

当然不需要，因为配置文件在运行时基本不会发生变更，所以我们只需要得到一个 Meta 对象，保存到内存中，之后就可以复用了，避免重复创建对象的开销。

为了实现这个能力，我们可以使用一种设计模式 —— 单例模式。保证项目运行期间只有一个 Meta 对象被创建，并且能够轻松获取。

在 `maker.meta` 包下新建 `MetaManager` 类，用于实现单例模式，代码如下： 

```java
package com.yupi.maker.meta;
        
        import cn.hutool.core.io.resource.ResourceUtil;
        import cn.hutool.json.JSONUtil;
        
        public class MetaManager {
        
            private static volatile Meta meta;
        
            private MetaManager() {
                // 私有构造函数，防止外部实例化
            }
        
            public static Meta getMetaObject() {
                if (meta == null) {
                    synchronized (MetaManager.class) {
                        if (meta == null) {
                            meta = initMeta();
                        }
                    }
                }
                return meta;
            }
        
            private static Meta initMeta() {
                String metaJson = ResourceUtil.readUtf8Str("meta.json");
                Meta newMeta = JSONUtil.toBean(metaJson, Meta.class);
                Meta.FileConfig fileConfig = newMeta.getFileConfig();
                // todo 校验和处理默认值
                return newMeta;
            }
        } 
```

解释一下上述代码：

1）定义了 `meta` 属性，用于接受 JSON 配置。使用 `volatile` 关键字修饰，确保多线程环境下的可见性。 

2）添加了一个私有构造函数，防止外部用 new 的方式创建出多个对象，破坏单例

3）定义了 `getMetaObject` 方法，用于获取 meta 对象。如果是首次获取，则执行 `initMeta` 方法来初始化 meta 对象；否则直接获取已有对象。此处使用 **双检锁 ** 进行并发控制，既保证了对象获取性能不会被锁影响，也能防止重复实例化。

4）定义了 `initMeta` 方法，用于从 JSON 文件中获取对象属性并初始化 meta 对象。当然后续还可以执行对象校验、填充默认值等操作。 

之后获取 meta 对象信息，只需要调用 `MetaManager.getMetaObject` 方法即可，相比每次都获取 JSON 文件并解析，提高了性能并简化代码。

单例模式除了双检锁实现外，还有一种很常见的实现方式 —— 饿汉式单例模式。

使用饿汉式单例模式， **类加载时即初始化对象实例** ，从而保证在任何时候都只有一个实例。 

饿汉式单例模式的优点是实现更简单，实现关键如下：

1）将 `meta` 属性声明为 `private static final`，并在声明时进行初始化。

2）将实例初始化逻辑提取到私有方法 `initMeta` 中，保持代码的清晰和可读性。 

由于本项目暂时不用，所以就不过多介绍了，给出示例代码：

```java
public class MetaManager {
        
            private static final Meta meta = initMeta();
        
            private MetaManager() {
                // 私有构造函数，防止外部实例化
            }
        
            public static Meta getMetaObject() {
                return meta;
            }
        
            private static Meta initMeta() {
                String projectPath = System.getProperty("user.dir");
                String metaJson = ResourceUtil.readUtf8Str("meta.json");
                Meta newMeta = JSONUtil.toBean(metaJson, Meta.class);
                // todo 校验和处理默认值
                return newMeta;
            }
        }
```

#### 调用测试 

可以在 `maker.generator.main` 包下新建 `MainGenerator.java`，测试能否获取到包含配置信息的 meta 对象。

代码如下：

```java
public class MainGenerator {
        
            public static void main(String[] args) {
                Meta meta = MetaManager.getMetaObject();
                System.out.println(meta);
            }
        } 
```

能成功获取到配置文件信息：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/63a00ca4-b04d-4e84-8c21-6d0a94061255.png)

### 3、生成数据模型文件 

之前数据模型文件（MainTemplateConfig.java）是我们自己编写的，现在我们要通过元信息自动生成。

#### 元信息定义

首先思考数据模型文件需要哪些元信息？ 

为了确认这点，我们要打开之前的项目，看看有哪些地方用到了数据模型文件，比如 `DataModel` 和 `GenerateCommand` 类：

> 使用 IDEA 的 `Alt + F7` 快捷键可以快速查看某个类在哪些地方被使用了
>

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/7558e79b-5cff-46d4-b023-db417a948267.png) 

通过分析上述文件，我们可以得到数据模型元信息的定义：

```json
{
            ...
          "modelConfig": {
            "models": [
              {
                "fieldName": "loop",
                "type": "boolean",
                "description": "是否生成循环",
                "defaultValue": false,
                "abbr": "l"
              },
              {
                "fieldName": "author",
                "type": "String",
                "description": "作者注释",
                "defaultValue": "yupi",
                "abbr": "a"
              },
              {
                "fieldName": "outputText",
                "type": "String",
                "description": "输出信息",
                "defaultValue": "sum = ",
                "abbr": "o"
              }
            ]
          }
        } 
```

分别解释： 

- fieldName：参数名称，模型字段的唯一标识
- type：参数类别，比如字符串、布尔等
- description：参数的描述信息 
- defaultValue：参数的默认值
- abbr：参数的缩写，用于生成命令行选项的缩写语法

#### 开发实现

有了上面的元信息，我们就可以生成数据模型文件了。 

但是让我们思考一个问题：如何实现代码生成呢？

是使用反射，还是像之前一样用 FreeMarker 生成代码？

答案显然是后者，因为我们制作工具的作用是制作代码生成器，生成的代码是要对开发者可见的，而不是在 Java 程序运行时动态生成、结束后不留痕迹，所以采用 FreeMarker 实现，而且可以直接复用之前的 `DynamicGenerator` 代码。 

首先在 `resources/templates/java/model` 目录下新建数据模型模板文件 `DataModel.java.ftl`，完整代码如下：

```java
package ${basePackage}.model;
        
        import lombok.Data;
        
        /**
         * 数据模型
         */
        @Data
        public class DataModel {
        <#list modelConfig.models as modelInfo>
        
            <#if modelInfo.description??>
            /**
             * ${modelInfo.description}
             */
            </#if>
            private ${modelInfo.type} ${modelInfo.fieldName}<#if modelInfo.defaultValue??> = ${modelInfo.defaultValue?c}</#if>;
        </#list>
        }  
```

上面的代码不难理解，主要就是将元信息中的配置填充到模板中，使用 `<#list>` 语法循环生成属性信息，使用 `<#if>` 语法来控制“有值才生成”。 

其中，`modelInfo.defaultValue?c` 的作用是将任何类型的变量（比如 boolean 类型和 String 类型）都转换为字符串。

#### 调用测试

可以在 `maker.generator.main` 包下的 `MainGenerator.java` 中编写调用测试代码，测试能否按照预期生成文件。 

调用代码的实现步骤如下：

1）定义生成文件的根路径。这里我们选择当前项目下的 `generated/生成器名称` 目录，注意需要在最外层项目的 `.gitignore` 文件中忽略 `generated` 目录。

2）定义要生成的 Java 代码根路径。需要将元信息中的 `basePackage` 转换为实际的文件路径。 

3）调用 `DynamicFileGenerator` 生成 `DataModel` 文件。

完整代码如下：

```java
public class MainGenerator {
        
            public static void main(String[] args) throws TemplateException, IOException {
                Meta meta = MetaManager.getMetaObject();
                System.out.println(meta);
        
                // 输出根路径
                String projectPath = System.getProperty("user.dir");
                String outputPath = projectPath + File.separator + "generated" + File.separator + meta.getName();
                if (!FileUtil.exist(outputPath)) {
                    FileUtil.mkdir(outputPath);
                }
        
                // 读取 resources 目录
                ClassPathResource classPathResource = new ClassPathResource("");
                String inputResourcePath = classPathResource.getAbsolutePath();
        
                // Java 包基础路径
                String outputBasePackage = meta.getBasePackage();
                String outputBasePackagePath = StrUtil.join("/", StrUtil.split(outputBasePackage, "."));
                String outputBaseJavaPackagePath = outputPath + File.separator + "src/main/java/" + outputBasePackagePath;
        
                String inputFilePath;
                String outputFilePath;
        
                // model.DataModel
                inputFilePath = inputResourcePath + File.separator + "templates/java/model/DataModel.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/model/DataModel.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
            }
        }
```

测试执行，成功在指定位置生成了文件：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/287581b3-c5d6-43aa-856a-b5c41a10bed2.png)

### 4、生成 Picocli 命令类 

之前 Picocli 命令行相关代码是我们自己编写的，包括：

1. 具体命令 `GenerateCommand.java`、`ListCommand.java` 和 `ConfigCommand.java `
2. 命令执行器：`CommandExecutor.java`
3. 调用命令执行器的主类：`Main.java `

现在这些文件都可以基于元信息自动生成。 

#### 开发实现

实现流程和上面生成数据模型文件完全一致，先定义 FTL 模板，然后编写调用测试代码。

1）编写代码生成命令模板文件 `GenerateCommand.java.ftl`，放在 `resources/templates/java/cli/command` 目录下。 

编写方法很简单，先复制现有的 `GenerateCommand.java` 文件，然后“挖坑”，把固定的参数使用元信息中的字段填充即可。

完整代码如下：

```json
package ${basePackage}.cli.command;
        
        import cn.hutool.core.bean.BeanUtil;
        import ${basePackage}.generator.MainGenerator;
        import ${basePackage}.model.DataModel;
        import lombok.Data;
        import picocli.CommandLine.Command;
        import picocli.CommandLine.Option;
        
        import java.util.concurrent.Callable;
        
        @Command(name = "generate", description = "生成代码", mixinStandardHelpOptions = true)
        @Data
        public class GenerateCommand implements Callable<Integer> {
        <#list modelConfig.models as modelInfo>
        
            @Option(names = {<#if modelInfo.abbr??>"-${modelInfo.abbr}", </#if>"--${modelInfo.fieldName}"}, arity = "0..1", <#if modelInfo.description??>description = "${modelInfo.description}", </#if>interactive = true, echo = true)
            private ${modelInfo.type} ${modelInfo.fieldName}<#if modelInfo.defaultValue??> = ${modelInfo.defaultValue?c}</#if>;
        </#list>
        
            public Integer call() throws Exception {
                DataModel dataModel = new DataModel();
                BeanUtil.copyProperties(this, dataModel);
                MainGenerator.doGenerate(dataModel);
                return 0;
            }
        }
         
```

2）编写查看文件列表命令模板文件 `ListCommand.java.ftl`，放在 `resources/templates/java/cli/command` 目录下。

这里我们需要把之前硬编码的项目文件路径改为读取元信息的 `fileConfig.inputRootPath` 字段动态生成，这个字段的作用就是指定模板文件的根路径，后面会讲到。

完整代码如下： 

```java
package ${basePackage}.cli.command;
        
        import cn.hutool.core.io.FileUtil;
        import picocli.CommandLine.Command;
        
        import java.io.File;
        import java.util.List;
        
        @Command(name = "list", description = "查看文件列表", mixinStandardHelpOptions = true)
        public class ListCommand implements Runnable {
        
            public void run() {
                // 输入路径
                String inputPath = "${fileConfig.inputRootPath}";
                List<File> files = FileUtil.loopFiles(inputPath);
                for (File file : files) {
                    System.out.println(file);
                }
            } 
        } 
```

3）编写查看参数配置命令模板文件 `ConfigCommand.java.ftl`，放在 `resources/templates/java/cli/command` 目录下。

完整代码如下： 

```java
package ${basePackage}.cli.command;
        
        import cn.hutool.core.util.ReflectUtil;
        import ${basePackage}.model.DataModel;
        import picocli.CommandLine.Command;
        
        import java.lang.reflect.Field;
        
        @Command(name = "config", description = "查看参数信息", mixinStandardHelpOptions = true)
        public class ConfigCommand implements Runnable {
        
            public void run() {
                // 实现 config 命令的逻辑
                System.out.println("查看参数信息");
        
                Field[] fields = ReflectUtil.getFields(DataModel.class);
        
                // 遍历并打印每个字段的信息
                for (Field field : fields) {
                    System.out.println("字段名称：" + field.getName());
                    System.out.println("字段类型：" + field.getType());
                    System.out.println("---");
                }
            }
        }
```

4）编写命令执行器模板文件 `CommandExecutor.java.ftl`，放在 `resources/templates/java/cli` 目录下。

完整代码如下： 

```java
package ${basePackage}.cli;
        
        import ${basePackage}.cli.command.GenerateCommand;
        import ${basePackage}.cli.command.ListCommand;
        import ${basePackage}.cli.command.ConfigCommand;
        import picocli.CommandLine;
        import picocli.CommandLine.Command;
        
        /**
         * 命令执行器
         */
        @Command(name = "${name}", mixinStandardHelpOptions = true)
        public class CommandExecutor implements Runnable {
        
            private final CommandLine commandLine;
        
            {
                commandLine = new CommandLine(this)
                        .addSubcommand(new GenerateCommand())
                        .addSubcommand(new ConfigCommand())
                        .addSubcommand(new ListCommand());
            }
        
            @Override
            public void run() {
                // 不输入子命令时，给出友好提示
                System.out.println("请输入具体命令，或者输入 --help 查看命令提示");
            }
        
            /**
             * 执行命令
             *
             * @param args
             * @return
             */
            public Integer doExecute(String[] args) {
                return commandLine.execute(args);
            }
        } 
```

5）编写调用命令执行器的 Main 方法对应的模板文件 `Main.java.ftl`，放在 `resources/templates/java` 目录下。

完整代码如下： 

```java
package ${basePackage};
        
        import ${basePackage}.cli.CommandExecutor;
        
        public class Main {
        
            public static void main(String[] args) {
                CommandExecutor commandExecutor = new CommandExecutor();
                commandExecutor.doExecute(args);
            }
        }
```

#### 调用测试

可以在 `maker.generator.main` 包下的 `MainGenerator.java` 中编写调用测试代码，测试能否按照预期生成文件。 

直接在之前的代码中补充，调用 `DynamicFileGenerator`来生成命令类相关代码文件。

`MainGenerator.java` 新增代码：

```java
public class MainGenerator {
        
            public static void main(String[] args) throws TemplateException, IOException {
                ...
                // cli.command.ConfigCommand
                inputFilePath = inputResourcePath + File.separator + "templates/java/cli/command/ConfigCommand.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/cli/command/ConfigCommand.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
        
                // cli.command.GenerateCommand
                inputFilePath = inputResourcePath + File.separator + "templates/java/cli/command/GenerateCommand.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/cli/command/GenerateCommand.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
        
                // cli.command.ListCommand
                inputFilePath = inputResourcePath + File.separator + "templates/java/cli/command/ListCommand.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/cli/command/ListCommand.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
        
                // cli.CommandExecutor
                inputFilePath = inputResourcePath + File.separator + "templates/java/cli/CommandExecutor.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/cli/CommandExecutor.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
        
                // Main
                inputFilePath = inputResourcePath + File.separator + "templates/java/Main.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/Main.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
            }
        } 
```

测试执行，成功在指定位置生成了文件：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/0c7b99d1-f7e9-47ba-96e3-56567bfc1161.png)

然后我们就可以把 maker 项目中的 `cli` 包删掉了（记得把调用 cli 包的代码也注释或删除掉）~ 

当前项目的目录结构如下：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/1d7ecb08-f91c-4846-9686-793340af769a.png)

### 5、生成代码生成文件 

之前第一阶段的 `yuzi-generator-basic` 项目中，我们已经编写好了代码生成相关文件，包括：`DynamicGenerator.java`、`MainGenerator.java`、`StaticGenerator.java` ，最终通过调用 `MainGenerator` 来生成代码。

但是，之前我们是直接将项目文件路径硬编码到了生成文件中：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/96e35b07-2e58-4dd7-b5cf-faaf629fc0c3.png) 

如果要生成多个动态文件，还要手动填写多个模板文件的路径，这种方式真是太不优雅了！

现在我们要改为通过元信息自动生成这些文件。

#### 元信息定义 

首先思考，生成这些文件需要哪些元信息？

为了确认这点，我们要仔细分析之前的 `MainGenerator.java` 文件。

通过分析，我们可以得到文件生成元信息的定义： 

```json
{
            ...
          "fileConfig": {
            "inputRootPath": "/Users/yupi/Code/yuzi-generator/yuzi-generator-demo-projects/acm-template-pro",
            "outputRootPath": "generated",
            "type": "dir",
            "files": [
              {
                "inputPath": "src/com/yupi/acm/MainTemplate.java.ftl",
                "outputPath": "src/com/yupi/acm/MainTemplate.java",
                "type": "file",
                "generateType": "dynamic"
              },
              {
                "inputPath": ".gitignore",
                "outputPath": ".gitignore",
                "type": "file",
                "generateType": "static"
              },
              {
                "inputPath": "README.md",
                "outputPath": "README.md",
                "type": "file",
                "generateType": "static"
              }
            ]
          }
        } 
```

分别解释：

- inputRootPath：输入模板文件的根路径，即到哪里去找 FTL 模板文件（可以是相对路径）
- outputRootPath：输出最终代码的根路径（可以是相对路径）
- type：文件类别，目录或文件 
- files：子文件列表，支持递归
  - inputPath：输入文件的具体路径（可以是相对路径）
  - outputPath：输出文件的具体路径（可以是相对路径）
  - generateType：文件的生成类型，静态或动态 

##### 文件路径规则选取

这里做一个小小的头脑风暴，文件路径是一层一层递归，还是像上面一样折叠没有文件的目录路径呢？

一层层递归的结构类似： 

```json
"files": [
           {
             "path": "src",
             "type": "dir",
             "files": [
               {
                 "path": "com",
                 "type": "dir",
                 "files": [
                   {
                     
                   }
                 ]
               }
             ]
           }
        ] 
```

折叠路径结构：

```json
"files": [
           {
             "path": "src/com",
             "type": "dir"
           }
        ]
       
```

你会如何选择呢？

这里鱼皮的选择是后者，尽量折叠路径。为什么呢？

两个原因： 

1. 考虑到 URL 地址的场景，路径的结构不一定需要展开
2. 扁平化的路径会让 JSON 结构更清晰精简，前期更利于开发和维护

而且这两种结构其实是可以通过编写程序相互转换的，所以目前先采用成本最低的方式。

> 注意，项目开发时你可以选择更简单的做法，但是要给自己想好退路，应对未来可能的需求变更。
>

#### 开发实现

有了上面的元信息，我们就可以生成 Generator 文件了。

1） 在 `resources/templates/java/generator` 目录下新建模板文件 `MainGenerator.java.ftl`。 

这个文件的编写还是有点复杂的，如果没办法一次性编写出 FTL 模板文件，我们就先编写一个可执行的目标代码。

打开 `yuzi-generator-basic` 项目，修改 `MainGenerator.java` 文件：

```java
/**
         * 核心生成器
         */
        public class MainGenerator {
        
            /**
             * 生成
             *
             * @param model 数据模型
             * @throws TemplateException
             * @throws IOException
             */
            public static void doGenerate(Object model) throws TemplateException, IOException {
                String inputRootPath = "C:\\code\\yuzi-generator\\yuzi-generator-demo-projects\\acm-template-pro";
                String outputRootPath = "C:\\code\\yuzi-generator\\acm-template-pro";
                
                String inputPath;
                String outputPath;
        
                inputPath = new File(inputRootPath, "src/com/yupi/acm/MainTemplate.java.ftl").getAbsolutePath();
                outputPath = new File(outputRootPath, "src/com/yupi/acm/MainTemplate.java").getAbsolutePath();
                DynamicGenerator.doGenerate(inputPath, outputPath, model);
        
                inputPath = new File(inputRootPath, ".gitignore").getAbsolutePath();
                outputPath = new File(outputRootPath, ".gitignore").getAbsolutePath();
                StaticGenerator.copyFilesByHutool(inputPath, outputPath);
        
                inputPath = new File(inputRootPath, "README.md").getAbsolutePath();
                outputPath = new File(outputRootPath, "README.md").getAbsolutePath();
                StaticGenerator.copyFilesByHutool(inputPath, outputPath);
            }
        }
         
```

注意，上述代码中的 `inputRootPath` 和 `outputRootPath` 都要改为自己本地的绝对路径！

然后可以编写一个 main 方法测试上面的代码能否正确生成文件：

```java
 public static void main(String[] args) throws TemplateException, IOException {
            MainTemplateConfig mainTemplateConfig = new MainTemplateConfig();
            mainTemplateConfig.setAuthor("yupi");
            mainTemplateConfig.setLoop(false);
            mainTemplateConfig.setOutputText("求和结果：");
            doGenerate(mainTemplateConfig);
        } 
```

如果能够生成，说明目标代码是正确的，就可以参考它来编写模板文件了。

完整代码如下：

```java
package ${basePackage}.generator;
        
        import com.yupi.model.DataModel;
        import freemarker.template.TemplateException;
        
        import java.io.File;
        import java.io.IOException;
        
        /**
         * 核心生成器
         */
        public class MainGenerator {
        
            /**
             * 生成
             *
             * @param model 数据模型
             * @throws TemplateException
             * @throws IOException
             */
            public static void doGenerate(Object model) throws TemplateException, IOException {
                String inputRootPath = "${fileConfig.inputRootPath}";
                String outputRootPath = "${fileConfig.outputRootPath}";
        
                String inputPath;
                String outputPath;
            <#list fileConfig.files as fileInfo>
            
                inputPath = new File(inputRootPath, "${fileInfo.inputPath}").getAbsolutePath();
                outputPath = new File(outputRootPath, "${fileInfo.outputPath}").getAbsolutePath();
                <#if fileInfo.generateType == "static">
                StaticGenerator.copyFilesByHutool(inputPath, outputPath);
                <#else>
                DynamicGenerator.doGenerate(inputPath, outputPath, model);
                </#if>
            </#list>
            }
        } 
```

2） 在 `resources/templates/java/generator` 目录下新建模板文件 `DynamicGenerator.java.ftl`。

由于该文件是一个通用的动态代码生成工具，所以不需要定制，修改下包名即可。

完整代码如下： 

```java
package ${basePackage}.generator;
        
        import cn.hutool.core.io.FileUtil;
        import freemarker.template.Configuration;
        import freemarker.template.Template;
        import freemarker.template.TemplateException;
        
        import java.io.File;
        import java.io.FileWriter;
        import java.io.IOException;
        import java.io.Writer;
        
        /**
         * 动态文件生成
         */
        public class DynamicGenerator {
        
            /**
             * 生成文件
             *
             * @param inputPath 模板文件输入路径
             * @param outputPath 输出路径
             * @param model 数据模型
             * @throws IOException
             * @throws TemplateException
             */
            public static void doGenerate(String inputPath, String outputPath, Object model) throws IOException, TemplateException {
                // new 出 Configuration 对象，参数为 FreeMarker 版本号
                Configuration configuration = new Configuration(Configuration.VERSION_2_3_32);
        
                // 指定模板文件所在的路径
                File templateDir = new File(inputPath).getParentFile();
                configuration.setDirectoryForTemplateLoading(templateDir);
        
                // 设置模板文件使用的字符集
                configuration.setDefaultEncoding("utf-8");
        
                // 创建模板对象，加载指定模板
                String templateName = new File(inputPath).getName();
                Template template = configuration.getTemplate(templateName);
        
                // 文件不存在则创建文件和父目录
                if (!FileUtil.exist(outputPath)) {
                    FileUtil.touch(outputPath);
                }
        
                // 生成
                Writer out = new FileWriter(outputPath);
                template.process(model, out);
        
                // 生成文件后别忘了关闭哦
                out.close();
            }
        
        } 
```

3）在 `resources/templates/java/generator` 目录下新建模板文件 `StaticGenerator.java.ftl`。

由于该文件是一个通用的静态文件生成工具，所以不需要定制，修改下包名即可。 

完整代码如下：

```java
package ${basePackage}.generator;
        
        import cn.hutool.core.io.FileUtil;
        
        /**
         * 静态文件生成
         */
        public class StaticGenerator {
        
            /**
             * 拷贝文件（Hutool 实现，会将输入目录完整拷贝到输出目录下）
             *
             * @param inputPath
             * @param outputPath
             */
            public static void copyFilesByHutool(String inputPath, String outputPath) {
                FileUtil.copy(inputPath, outputPath, false);
            }
        } 
```

新建完上述模板文件后，`resources` 目录的结构如下： 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/f96ec8a9-ce52-483c-aae7-0263351fa35a.png)

#### 调用测试

可以在 `maker.generator.main` 包下的 `MainGenerator.java` 中编写调用测试代码，测试能否按照预期生成文件。 

直接在之前的代码中补充，调用 `DynamicFileGenerator`来生成命令类相关代码文件。

`MainGenerator.java` 新增代码：

```java
public class MainGenerator {
        
            public static void main(String[] args) throws TemplateException, IOException {
                ...
                // generator.DynamicGenerator
                inputFilePath = inputResourcePath + File.separator + "templates/java/generator/DynamicGenerator.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/generator/DynamicGenerator.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
        
                // generator.MainGenerator
                inputFilePath = inputResourcePath + File.separator + "templates/java/generator/MainGenerator.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/generator/MainGenerator.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
        
                // generator.StaticGenerator
                inputFilePath = inputResourcePath + File.separator + "templates/java/generator/StaticGenerator.java.ftl";
                outputFilePath = outputBaseJavaPackagePath + "/generator/StaticGenerator.java";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
            }
        } 
```

测试执行，成功在指定位置生成了文件：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/c3f92ec7-46bf-4d28-ad24-0112900b051c.png)

之后，如果我们要更换输入项目模板的路径或生成目标代码的输出路径，直接修改 `fileConfig` 的相关配置即可，不用再自己修改代码了。 

### 6、程序构建 jar 包

之前我们是通过手动执行 Maven 命令来构建 jar 包的，那么如果要实现程序自动构建 jar 包，只需要让程序来执行 Maven 打包命令即可。

#### 开发实现 

1）首先需要在本地（或服务器）安装 Maven 并配置环境变量，参考教程：https://blog.csdn.net/qq_45344586/article/details/130935169

安装完成后，打开终端，执行 `mvn -v` 命令检测是否安装成功，鱼皮本地的环境是 Maven 3.9.5：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/97ccc0e1-8f5c-4041-aba8-4cde2adc0b1f.png) 

2）在 `generator` 目录下新建 `JarGenerator.java` 类，编写 jar 包构建逻辑。

程序实现的关键是：使用 Java 内置的 Process 类执行 Maven 打包命令，并获取到命令的输出信息。 **需要注意，不同的操作系统，执行的命令代码不同。**

完整代码如下： 

```java
package com.yupi.maker.generator;
        
        import java.io.*;
        
        public class JarGenerator {
        
            public static void doGenerate(String projectDir) throws IOException, InterruptedException {
                // 清理之前的构建并打包
                // 注意不同操作系统，执行的命令不同
                String winMavenCommand = "mvn.cmd clean package -DskipTests=true";
                String otherMavenCommand = "mvn clean package -DskipTests=true";
                String mavenCommand = winMavenCommand;
                
                // 这里一定要拆分！
                ProcessBuilder processBuilder = new ProcessBuilder(mavenCommand.split(" "));
                processBuilder.directory(new File(projectDir));
        
                Process process = processBuilder.start();
        
                // 读取命令的输出
                InputStream inputStream = process.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
        
                // 等待命令执行完成
                int exitCode = process.waitFor();
                System.out.println("命令执行结束，退出码：" + exitCode);
            }
        
            public static void main(String[] args) throws IOException, InterruptedException {
                doGenerate("C:\\code\\yuzi-generator\\yuzi-generator-maker\\generated\\acm-template-pro-generator");
            }
        } 
```

需要注意，要把上述代码 main 方法中的生成路径改为自己本地的项目路径。

3）想使用 Maven 打包项目，项目的根目录下必须要有 `pom.xml` 项目管理文件。这个文件也是需要根据元信息动态生成的。 

在 `resources/templates` 目录下新建 `pom.xml.ftl` 模板文件，用于动态生成 pom.xml。

需要根据元信息动态替换项目信息、主运行类（mainClass） 的包路径等。

完整代码如下： 

```xml
<?xml version="1.0" encoding="UTF-8"?>
        <project xmlns="http://maven.apache.org/POM/4.0.0"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
            <modelVersion>4.0.0</modelVersion>
        
            <groupId>${basePackage}</groupId>
            <artifactId>${name}</artifactId>
            <version>${version}</version>
        
            <properties>
                <maven.compiler.source>8</maven.compiler.source>
                <maven.compiler.target>8</maven.compiler.target>
                <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
            </properties>
        
            <dependencies>
                <!-- https://freemarker.apache.org/index.html -->
                <dependency>
                    <groupId>org.freemarker</groupId>
                    <artifactId>freemarker</artifactId>
                    <version>2.3.32</version>
                </dependency>
                <!-- https://picocli.info -->
                <dependency>
                    <groupId>info.picocli</groupId>
                    <artifactId>picocli</artifactId>
                    <version>4.7.5</version>
                </dependency>
                <!-- https://doc.hutool.cn/ -->
                <dependency>
                    <groupId>cn.hutool</groupId>
                    <artifactId>hutool-all</artifactId>
                    <version>5.8.16</version>
                </dependency>
                <!-- https://mvnrepository.com/artifact/org.apache.commons/commons-collections4 -->
                <dependency>
                    <groupId>org.apache.commons</groupId>
                    <artifactId>commons-collections4</artifactId>
                    <version>4.4</version>
                </dependency>
                <!-- https://projectlombok.org/ -->
                <dependency>
                    <groupId>org.projectlombok</groupId>
                    <artifactId>lombok</artifactId>
                    <version>1.18.30</version>
                    <scope>provided</scope>
                </dependency>
                <dependency>
                    <groupId>junit</groupId>
                    <artifactId>junit</artifactId>
                    <version>4.13.2</version>
                    <scope>test</scope>
                </dependency>
            </dependencies>
        
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-assembly-plugin</artifactId>
                        <version>3.3.0</version>
                        <configuration>
                            <descriptorRefs>
                                <descriptorRef>jar-with-dependencies</descriptorRef>
                            </descriptorRefs>
                            <archive>
                                <manifest>
                                    <mainClass>${basePackage}.Main</mainClass> <!-- 替换为你的主类的完整类名 -->
                                </manifest>
                            </archive>
                        </configuration>
                        <executions>
                            <execution>
                                <phase>package</phase>
                                <goals>
                                    <goal>single</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </project> 
```

在 `MainGenerator` 中追加代码，生成 pom.xml 文件，然后调用 jar 包生成：

```java
public class MainGenerator {
        
            public static void main(String[] args) throws TemplateException, IOException, InterruptedException {
                ...
                // pom.xml
                inputFilePath = inputResourcePath + File.separator + "templates/pom.xml.ftl";
                outputFilePath = outputPath + File.separator + "pom.xml";
                DynamicFileGenerator.doGenerate(inputFilePath , outputFilePath, meta);
                
                // 构建 jar 包
                JarGenerator.doGenerate(outputPath);
            }
        } 
```

#### 调用测试

执行 `MainGenerator`，首次构建需要拉取依赖信息，要等一段时间。

最后看到下图的输出信息，表示打包成功： 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/db0b66f1-8405-4f30-b26e-0d655ec6652f.png)

在生成的目录中看到了 pom.xml 和 jar 包文件：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/0daba1c4-4e5f-485d-a32e-6d59338706de.png) 

### 7、程序封装脚本

有了 jar 包后，我们就可以根据 jar 包的路径，让程序来自动生成脚本文件了。

#### 开发实现 

1）在 `generator` 目录下新建 `ScriptGenerator.java` 类，编写脚本文件生成逻辑。

首先要将生成逻辑封装为一个方法，方法需要传入 jar 包路径（jarPath），因为不同的元信息构建出的 jar 包名称和路径是不同的。

由于脚本文件的内容非常简单，只有几行代码，所以不用编写 FTL 模板了，直接使用 StringBuilder 拼接字符串，然后写入文件。 

注意，如果不是 Windows 系统，还需要在生成文件后，使用 `PosixFilePermissions` 类给文件默认添加可执行权限。

完整代码如下：

```java
public class ScriptGenerator {
        
            public static void doGenerate(String outputPath, String jarPath) throws IOException {
                // 直接写入脚本文件
                // linux
                StringBuilder sb = new StringBuilder();
                sb.append("#!/bin/bash").append("\n");
                sb.append(String.format("java -jar %s \"$@\"", jarPath)).append("\n");
                FileUtil.writeBytes(sb.toString().getBytes(StandardCharsets.UTF_8), outputPath);
                // 添加可执行权限
                try {
                    Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxrwxrwx");
                    Files.setPosixFilePermissions(Paths.get(outputPath), permissions);
                } catch (Exception e) {
                    
                }
        
                // windows
                sb = new StringBuilder();
                sb.append("@echo off").append("\n");
                sb.append(String.format("java -jar %s %%*", jarPath)).append("\n");
                FileUtil.writeBytes(sb.toString().getBytes(StandardCharsets.UTF_8), outputPath + ".bat");
            }
        
            public static void main(String[] args) throws IOException {
                String outputPath = System.getProperty("user.dir") + File.separator + "generator";
                doGenerate(outputPath, "");
            }
        } 
```

2）在 `MainGenerator` 中追加代码，根据元信息拼接 jar 包路径，并传给 `ScriptGenerator` 来生成脚本。

追加代码如下：

```java
public class MainGenerator {
        
            public static void main(String[] args) throws TemplateException, IOException, InterruptedException {
                ...
                
                // 封装脚本
                String shellOutputFilePath = outputPath + File.separator + "generator";
                String jarName = String.format("%s-%s-jar-with-dependencies.jar", meta.getName(), meta.getVersion());
                String jarPath = "target/" + jarName;
                ScriptGenerator.doGenerate(shellOutputFilePath, jarPath);
            }
        } 
```

#### 调用测试

执行 `MainGenerator`，看到了生成的脚本文件：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/af4c333b-8a1d-4bab-b89c-9ede3f812363.png) 

在终端中进入生成的项目目录，并运行脚本文件，看到下图的输出信息，表示生成脚本成功：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/fb26775e-ba33-4a9b-b9fa-517d1b8a6d40.png)

### 8、测试验证 

通过前面的几个步骤，我们已经能通过执行 `MainGenerator` 快速生成一个代码生成器的代码和执行脚本了，下面就验证下该脚本各功能是否能够正常使用。

执行 `generator generate` 命令，结果报错啦！

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/bfce454c-59b7-4b35-b464-65f1d0d74158.png) 

路径不存在？

打开生成的代码一看，原来是 `MainGenerator` 中的项目模板输入路径指定错了：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/6cb80481-417d-4203-b726-a3c05f6d0e45.png) 

我们需要修改 `meta.json` 元信息文件的 `fileConfig.inputRootPath`，改为自己本地的项目模板根目录：

> 注意，路径间用 `/` 符号分割
>

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/fc653d7b-302a-42e3-911b-12e03d7da3dc.png) 

修改完后，再次执行脚本，就能正常使用并生成代码啦！

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/380c86b3-5e71-485b-88d3-a26433a80b7e.png)

## 最后 

以上就是本节教程，我们以定义元信息为核心，制作了一款基础的代码生成器制作工具。开发者可以通过修改配置文件快速制作代码生成器，整个程序也变得更加灵活。

大家一定要把这种思维刻在 DNA 里，以后一旦项目中出现了硬编码，就要思考能否通过配置提升代码的灵活性和可扩展性。

但是目前代码生成器制作工具还存在很多的不足，比如实现不够优雅、机制不够完善、能力不够丰富，在后面的教程中，我们会不断优化制作工具。 

## 本期作业

1）理解元信息文件的作用

2）自己编写代码实现本节项目，并且在自己的代码仓库完成一次提交

3）思考现在的制作工具项目还有哪些不足之处？你会如何优化？