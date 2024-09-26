专门用于开发命令行工具的框架 

⭐️ Picocli（https://github.com/remkop/picocli）：优点是 GitHub 的 star 数多（4k+）、持续更新，支持颜色高亮、自动补全、子命令、帮助手册等，最推荐。 

2）控制台输入处理库

> 能够对用户在控制台的输入进行处理的库 

JLine（https://github.com/jline/jline3）：支持自动补全、行编辑、查看命令历史等，但官方文档内容略少、学习成本高。参考教程：https://zhuanlan.zhihu.com/p/43835406

3）命令行解析库

> 支持对命令行进行解析取值的库 

⭐️ JCommander（https://github.com/cbeust/jcommander）：注解驱动，可以直接把命令映射到对象上，从而大幅简化代码。GitHub 上近 2k star，比较推荐。 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/1936dbc8-9661-4d22-892f-f3003908c6cc.png)

Apache Commons CLI（https://github.com/apache/commons-cli）：简单易用，但是功能不够多。参考教程：https://blog.csdn.net/liuxiangke0210/article/details/78141887

Jopt Simple（https://github.com/jopt-simple/jopt-simple）：不推荐。冷门、很久没维护、star 数少、生态不好



## 二、Picocli 命令行框架入门 

网上有关 Picocli 框架的教程非常少，最推荐的入门方式除了看鱼皮的教程外，就是阅读官方文档了。

官方文档：https://picocli.info/

一般我们学习新技术的步骤是：先跑通入门 Demo，再学习该技术的用法和特性。

### 入门 Demo

1）在 `yuzi-generator-basic` 项目的 `pom.xml` 文件中引入 picocli 的依赖： 

```xml
<!-- https://picocli.info -->
<dependency>
    <groupId>info.picocli</groupId>
    <artifactId>picocli</artifactId>
    <version>4.7.5</version>
</dependency> 
```

然后我们在 `com.yupi` 包下新建 `cli.example` 包，用于存放所有和 Picocli 入门有关的示例代码。

2）复制官方快速入门教程中的示例代码到 `com.yupi.cli.example` 包下，并略微修改 run 方法中的代码，打印参数的值。 

完整代码如下：

```java
import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

@Command(name = "ASCIIArt", version = "ASCIIArt 1.0", mixinStandardHelpOptions = true) 
public class ASCIIArt implements Runnable { 

    @Option(names = { "-s", "--font-size" }, description = "Font size") 
    int fontSize = 19;

    @Parameters(paramLabel = "<word>", defaultValue = "Hello, picocli", 
               description = "Words to be translated into ASCII art.")
    private String[] words = { "Hello,", "picocli" }; 

    @Override
    public void run() {
        // 自己实现业务逻辑
        System.out.println("fontSize = " + fontSize);
        System.out.println("words = " + String.join(",", words));
    }

    public static void main(String[] args) {
        int exitCode = new CommandLine(new ASCIIArt()).execute(args); 
        System.exit(exitCode); 
    }
} 
```

看不懂这段代码没关系，官方文档已经给了非常详细的解释： 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/7dd52353-6ff7-4857-9e23-2c905b2a1818.png)

帮大家翻译一下：

1. 创建一个实现 `Runnable` 或 `Callable` 接口的类，这就是一个命令。
2. 使用 `@Command` 注解标记该类并为其命名，`mixinStandardHelpOptions` 属性设置为 true 可以给应用程序自动添加 `--help` 和 `--version` 选项。
3. 通过 `@Option` 注解将字段设置为命令行选项，可以给选项设置名称和描述。
4. 通过 `@Parameters` 注解将字段设置为命令行参数，可以指定默认值、描述等信息。
5. Picocli 会将命令行参数转换为强类型值，并自动注入到注解字段中。
6. 在类的 `run` 或 `call` 方法中定义业务逻辑，当命令解析成功（用户敲了回车）后被调用。 
7. 在 `main` 方法中，通过 `CommandLine` 对象的 `execute ` 方法来处理用户输入的命令，剩下的就交给 Picocli 框架来解析命令并执行业务逻辑啦~
8. `CommandLine.execute` 方法返回一个退出代码。可以调用 `System.exit` 并将该退出代码作为参数，从而向调用进程表示成功或失败。

3）让我们更改主程序的执行参数（args）来测试程序，能够成功看到输出结果，如下图：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/8d96400a-b9fa-43dc-b398-b8b30a121e5e.png)

### 实用功能 

#### 1、帮助手册

示例代码如下：

```java
@Option(names = { "-s", "--font-size" }, description = "Font size") 
int fontSize = 19;

@Parameters(paramLabel = "<word>", defaultValue = "Hello, picocli", 
           description = "Words to be translated into ASCII art.")
private String[] words = { "Hello,", "picocli" };
```

可以给这些注解指定参数，比较常用的参数有： 

1）@Option 注解的 names 参数：指定选项英文名称。

2）description 参数：指定描述信息，从而让生成的帮助手册和提示信息更清晰。

3）@Parameters 注解的 paramLabel 参数：参数标签，作用类似于描述信息。

4）@Parameters 注解的 defaultValue 参数：默认值，参考文档：https://picocli.info/#_default_values

5）required 参数：要求必填，参考文档：https://picocli.info/#_required_arguments

示例代码如下：

```java
class RequiredOption { 
    @Option(names = "-a", required = true)
    String author;
}
```

此外，命令解析天然支持 **多值选项** ，只需要把对象属性的类型设置为数组类型即可，比如：

```java
@Option(names = "-option")
int[] values;
```

具体可以参考官方文档：https://picocli.info/#_multiple_values

更多关于选项和参数注解的用法，也可以阅读官方文档学习：https://picocli.info/quick-guide.html#_options_and_parameters

#### 3、交互式输入 

所谓的交互式输入就是允许用户像跟程序聊天一样，在程序的指引下一个参数一个参数地输入。

如下图：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/45f55d15-f8ee-4734-8f32-4ff0de017144.png) 

Picocli 为交互式输入提供了很好的支持，我梳理了大概 4 种交互式输入的模式。

##### 1）基本能力

交互式输入的一个典型应用场景就是：用户要登录时，引导 ta 输入密码。 

官方已经为我们提供了一段交互式输入的示例代码，鱼皮对它进行了简化，示例代码如下：

> 参考官方文档：https://picocli.info/#_interactive_password_options

```java
package com.yupi.cli.example;

import picocli.CommandLine;
import picocli.CommandLine.Option;

import java.util.concurrent.Callable;

public class Login implements Callable<Integer> {
    @Option(names = {"-u", "--user"}, description = "User name")
    String user;

    @Option(names = {"-p", "--password"}, description = "Passphrase", interactive = true)
    String password;

    public Integer call() throws Exception {
        System.out.println("password = " + password);
        return 0;
    }

    public static void main(String[] args) {
        new CommandLine(new Login()).execute("-u", "user123", "-p");
    }
} 
```

让我们分析下上面的代码，主要包含 4 个部分：

2）将 `@Option` 注解的 `interactive` 参数设置为 true，表示该选项支持交互式输入

```java
@Option(names = {"-p", "--password"}, interactive = true)
String password;
```

注意，如果以 jar 包方式运行上述程序，用户的输入默认是不会显示在控制台的（类似输入密码时的体验）。从 Picocli 4.6 版本开始，可以通过指定 `@Option` 注解的 `echo` 参数为 true 来显示用户的输入，并通过 `prompt` 参数指定引导用户输入的提示语。

##### 2）多个选项交互式

Picocli 支持在一个命令中指定多个交互式输入的选项，会按照顺序提示用户并接收输入。

在上述代码中再增加一个 checkPassword 选项，同样开启交互式输入，代码如下： 

```java
public class Login implements Callable<Integer> {
    @Option(names = {"-u", "--user"}, description = "User name")
    String user;

    @Option(names = {"-p", "--password"}, description = "Passphrase", interactive = true)
    String password;

    @Option(names = {"-cp", "--checkPassword"}, description = "Check Password", interactive = true)
    String checkPassword;

    public Integer call() throws Exception {
        System.out.println("password = " + password);
        System.out.println("checkPassword = " + checkPassword);
        return 0;
    }

    public static void main(String[] args) {
	    new CommandLine(new Login()).execute("-u", "user123", "-p", "-cp");
    } 
} 
```

##### 3）可选交互式 

默认情况下，是无法直接在命令中给交互式选项指定任何参数的，只能通过交互式输入，比如命令中包含 `-p xxx` 会报错。

> 可选交互式官方文档：https://picocli.info/#_optionally_interactive

让我们测试一下，给上面的示例代码输入以下参数：

```java
new CommandLine(new Login()).execute("-u", "user123", "-p", "xxx", "-cp");
```

执行效果如下图，出现了参数不匹配的报错：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/cfc7b332-50a8-4da2-b349-d33dda54112a.png)

官方提供了可选交互式的解决方案，通过调整 `@Option` 注解中的 `arity` 属性来指定每个选项可接受的参数个数，就能解决这个问题。

> arity 官方介绍：https://picocli.info/#_arity

示例代码如下： 

```java
@Option(names = {"-p", "--password"}, arity = "0..1", description = "Passphrase", interactive = true)
String password; 
```

然后可以直接在完整命令中给交互式选项设置值：

```java
new CommandLine(new Login()).execute("-u", "user123", "-p", "123" , "-cp"); 
```

执行结果如图，不再提示让用户输入 password 选项，而是直接读取了命令中的值：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/cfce94ed-f27c-411f-9c57-42c9a1391e60.png)

这里鱼皮推荐一个最佳实践：建议给所有需要交互式输入的选项都增加 `arity` 参数（一般是 `arity = "0..1"`），这样用户既可以在完整命令中直接给选项填充参数，也可以选择交互式输入。

##### 4）强制交互式 

在之前已经提到，如果用户不在命令中输入交互式选项（比如 `-p`），那么系统不会提示用户输入这个选项，属性的值将为默认值（比如 null）。

举个例子，下列命令中不带 `-p` 选项：

```java
new CommandLine(new Login()).execute("-u", "user123"); 
```

执行就会发现，程序不会提示用户输入 `-p` 选项的参数，而是直接输出结果，值为 null：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/177163a7-356c-4e3f-b075-b22ee25dbd18.png)

但有些时候，我们要求用户必须输入某个选项，而不能使用默认的空值，怎么办呢？ 

官方给出了强制交互式的解决方案，参考文档：https://picocli.info/#_forcing_interactive_input

但是，官方的解决方案是需要自己定义业务逻辑的。原理是在命令执行后对属性进行判断，如果用户没有输入指定的参数，那么再通过 `System.console().readLine` 等方式提示用户输入，示例代码如下：

```java
@Command
public class Main implements Runnable {
    @Option(names = "--interactive", interactive = true)
    String value;

    public void run() {
        if (value == null && System.console() != null) {
            // 主动提示用户输入
            value = System.console().readLine("Enter value for --interactive: ");
        }
        System.out.println("You provided value '" + value + "'");
    }

    public static void main(String[] args) {
        new CommandLine(new Main()).execute(args);
    }
} 
```

个人不是很喜欢这种方案，因为要额外编写提示代码，感觉又回到自主实现了。

鱼皮想出的一种方案是，编写一段通用的校验程序，如果用户的输入命令中没有包含交互式选项，那么就自动为输入命令补充该选项即可，这样就能强制触发交互式输入。

说通俗一点，检测 args 数组中是否存在对应选项，不存在则为数组增加选项元素。1638649696178216961_0.594121929104469

该思路作为一个小扩展点，实现起来并不复杂，大家可以自行实现。（小提示：可以利用反射自动读取必填的选项名称）

#### 4、子命令

子命令是指命令中又包含一组命令，相当于命令的分组嵌套，适用于功能较多、较为复杂的命令行程序，比如 git、docker 命令等。1638649696178216961_0.7683567303848711

官方文档：https://picocli.info/#_subcommands

在 Picocli 中，提供了两种设置子命令的方式。

##### 1）声明式 

通过 `@Command` 注解的 `subcommands` 属性来给命令添加子命令，优点是更直观清晰。

示例代码如下：

```java
@Command(subcommands = {
    GitStatus.class,
    GitCommit.class,
    GitAdd.class,
    GitBranch.class,
    GitCheckout.class,
    GitClone.class,
    GitDiff.class,
    GitMerge.class,
    GitPush.class,
    GitRebase.class,
    GitTag.class
})
public class Git { /* ... */ }
1638649696178216961_0.52415418112070471638649696178216961_0.5111698743784199
```

##### 2）编程式

在创建 `CommandLine` 对象时，调用 `addSubcommand` 方法来绑定子命令，优点是更灵活。

示例代码如下：1638649696178216961_0.7640213702763201

```java
CommandLine commandLine = new CommandLine(new Git())
        .addSubcommand("status",   new GitStatus())
        .addSubcommand("commit",   new GitCommit())
        .addSubcommand("add",      new GitAdd())
        .addSubcommand("branch",   new GitBranch())
        .addSubcommand("checkout", new GitCheckout())
        .addSubcommand("clone",    new GitClone())
        .addSubcommand("diff",     new GitDiff())
        .addSubcommand("merge",    new GitMerge())
        .addSubcommand("push",     new GitPush())
        .addSubcommand("rebase",   new GitRebase())
        .addSubcommand("tag",      new GitTag());
1638649696178216961_0.7877765339243965
```

##### 实践

让我们编写一个示例程序，支持增加、删除、查询 3 个子命令，并传入不同的 args 来测试效果。1638649696178216961_0.1299159729377939

完整代码如下：

```java
package com.yupi.cli.example;

import picocli.CommandLine;
import picocli.CommandLine.Command;

@Command(name = "main", mixinStandardHelpOptions = true)
public class SubCommandExample implements Runnable {

    @Override
    public void run() {
        System.out.println("执行主命令");
    }

    @Command(name = "add", description = "增加", mixinStandardHelpOptions = true)
    static class AddCommand implements Runnable {
        public void run() {
            System.out.println("执行增加命令");
        }
    }

    @Command(name = "delete", description = "删除", mixinStandardHelpOptions = true)
    static class DeleteCommand implements Runnable {
        public void run() {
            System.out.println("执行删除命令");
        }
    }

    @Command(name = "query", description = "查询", mixinStandardHelpOptions = true)
    static class QueryCommand implements Runnable {
        public void run() {
            System.out.println("执行查询命令");
        }
    }

    public static void main(String[] args) {
        // 执行主命令
        String[] myArgs = new String[] { };
        // 查看主命令的帮助手册
//        String[] myArgs = new String[] { "--help" };
        // 执行增加命令
//        String[] myArgs = new String[] { "add" };
        // 执行增加命令的帮助手册
//        String[] myArgs = new String[] { "add", "--help" };
        // 执行不存在的命令，会报错
//        String[] myArgs = new String[] { "update" };
        int exitCode = new CommandLine(new SubCommandExample())
                .addSubcommand(new AddCommand())
                .addSubcommand(new DeleteCommand())
                .addSubcommand(new QueryCommand())
                .execute(myArgs);
        System.exit(exitCode);
    }
} 
```

测试运行，发现当输入 `--help` 参数时，打印出了主命令和所有的子命令信息，证明子命令绑定成功： 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/a62685e2-5980-4a7e-8d92-edfd68d8f86d.png)

#### 5、其他功能

除了上面演示的功能外，还有一些可能有用的功能，大家感兴趣了解下就好，不要作为重点学习。

比如：

- 参数分组：https://picocli.info/#_argument_groups
- 错误处理：https://picocli.info/#_handling_errors
- 颜色高亮：https://picocli.info/#_ansi_colors_and_styles

### 更多学习资源 

关于 Picocli 的学习资源极少，还是以官方文档为主。

分享一篇还算完整的博客：

- Picocli 中文入门学习：https://blog.csdn.net/it_freshman/article/details/125458116

## 四、Picocli 命令行代码生成器开发

学习了 Picocli 框架的用法和命令模式后，我们可以运用它们来开发一款命令行代码生成器啦。

首先明确我们的需求，这个命令行程序需要支持 3 种子命令： 

- generate 子命令：生成文件
- list 子命令：查看要生成的原始文件列表信息
- config 子命令：查看允许用户传入的动态参数信息 

为了简化使用，要求能同时支持通过完整命令和交互式输入的方式来设置动态参数。

整个开发过程分为 6 个步骤： 

1. 创建命令执行器（主命令）
2. 分别实现每种子命令
3. 提供项目的全局调用入口 
4. 构建程序 jar 包
5. 测试使用
6. 简化使用（封装脚本） 

### 1、创建命令执行器

首先在 `com.yupi.cli.command` 包下新建 3 个子命令类，和需求对应：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/f64e9bf7-6160-453a-a687-8414fd373903.png)

然后在 `com.yupi.cli` 包下创建命令执行器 `Executor` 类，负责绑定所有子命令，并且提供执行命令的方法。

完整代码如下： 

```java
@Command(name = "yuzi", mixinStandardHelpOptions = true)
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

### 2、子命令实现

#### generate 子命令 

这是代码生成器的核心命令，作用是接受参数并生成代码。

实现步骤如下：

1）定义参数选项。和之前动态生成代码定义的数据模型 `MainTemplateConfig` 属性一致即可。使用 Picocli 提供的注解来交互式获取参数信息（interactive = true），并且对用户显示输入信息（echo = true）。 

2）使用 `BeanUtil.copyProperties` 快速将通过命令接受到的属性复制给 `MainTemplateConfig` 配置对象。

3）调用之前开发好的 `MainGenerator` 代码生成类来生成代码。

完整代码如下： 

```java
@Command(name = "generate", description = "生成代码", mixinStandardHelpOptions = true)
@Data
public class GenerateCommand implements Callable<Integer> { 
    @Option(names = {"-l", "--loop"}, arity = "0..1", description = "是否循环", interactive = true, echo = true)
    private boolean loop; 
    @Option(names = {"-a", "--author"}, arity = "0..1", description = "作者", interactive = true, echo = true)
    private String author = "yupi"; 
    @Option(names = {"-o", "--outputText"}, arity = "0..1", description = "输出文本", interactive = true, echo = true)
    private String outputText = "sum = "; 
    public Integer call() throws Exception {
        MainTemplateConfig mainTemplateConfig = new MainTemplateConfig();
        BeanUtil.copyProperties(this, mainTemplateConfig);
        System.out.println("配置信息：" + mainTemplateConfig);
        MainGenerator.doGenerate(mainTemplateConfig);
        return 0;
    }
} 
```

#### list 子命令

list 是一个辅助命令，作用是遍历输出所有要生成的文件列表。 

此处由于我们要生成的项目文件都封装在了 `acm-template` 目录下，所以直接用 Hutool 库提供的 `FileUtil.loopFiles(inputPath)` 方法来遍历该目录下的所有文件即可。

完整代码如下：

```java
@Command(name = "list", description = "查看文件列表", mixinStandardHelpOptions = true)
public class ListCommand implements Runnable {

    public void run() {
        String projectPath = System.getProperty("user.dir");
        // 整个项目的根路径
        File parentFile = new File(projectPath).getParentFile();
        // 输入路径
        String inputPath = new File(parentFile, "yuzi-generator-demo-projects/acm-template").getAbsolutePath();
        List<File> files = FileUtil.loopFiles(inputPath);
        for (File file : files) {
            System.out.println(file);
        }
    } 
}
```

#### config 子命令

config 是一个辅助命令，作用是输出允许用户传入的动态参数的信息（也就是本项目 `MainTemplateConfig` 类的字段信息）。

如何输出呢？ 

最简单粗暴的方法是直接自己手写打印信息，比较灵活。但是如果配置类的属性字段发生修改，也要同步修改 config 命令的代码，不利于维护。

更推荐的方式是通过 Java 的反射机制，在程序运行时动态打印出对象属性的信息。又有 2 种方法：

1）JDK 原生反射语法

示例代码如下：

```java
Class<?> myClass = MainTemplateConfig.class;
// 获取类的所有字段
Field[] fields = myClass.getDeclaredFields(); 
```

2）Hutool 的反射工具类（只需一行代码，更推荐） 

示例代码如下：

```java
Field[] fields = ReflectUtil.getFields(MainTemplateConfig.class); 
```

完整代码如下： 

```java
@Command(name = "config", description = "查看参数信息", mixinStandardHelpOptions = true)
public class ConfigCommand implements Runnable {

    public void run() {
        // 实现 config 命令的逻辑
        System.out.println("查看参数信息");

//        // 获取要打印属性信息的类
//        Class<?> myClass = MainTemplateConfig.class;
//        // 获取类的所有字段
//        Field[] fields = myClass.getDeclaredFields();

        Field[] fields = ReflectUtil.getFields(MainTemplateConfig.class);

        // 遍历并打印每个字段的信息
        for (Field field : fields) {
            System.out.println("字段名称：" + field.getName());
            System.out.println("字段类型：" + field.getType());
//            System.out.println("Modifiers: " + java.lang.reflect.Modifier.toString(field.getModifiers()));
            System.out.println("---");
        }
    }
}
```

### 3、全局调用入口

在项目的根包 `com.yupi` 下创建 Main 类，作为整个代码生成器项目的全局调用入口。作用是接受用户的参数、创建命令执行器并调用执行。

代码如下：

```java
public class Main {
    public static void main(String[] args) {
        CommandExecutor commandExecutor = new CommandExecutor();
        commandExecutor.doExecute(args);
    }
}
```

接下来我们需要对命令进行测试。建议直接在 main 方法中给 args 参数设置值来完成测试，比较灵活：

```java
public class Main {

    public static void main(String[] args) {
        args = new String[]{"generate", "-l", "-a", "-o"};
//        args = new String[]{"config"};
//        args = new String[]{"list"};
        CommandExecutor commandExecutor = new CommandExecutor();
        commandExecutor.doExecute(args);
    }
}
```

1）测试 generate 命令，执行并得到输出结果：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/120ad8fc-f947-4600-9994-9380eb938150.png)

成功查看到生成的代码：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/efcef379-2351-4400-911b-22fa2b2eb7fd.png)

2）测试 config 命令，输出结果如下图：1638649696178216961_0.91807327023237

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/921a0b9d-f760-4f67-8cc8-7e2f12e17349.png)

3）测试 list 命令，输出结果如下图：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/f402ffb6-05bd-4b76-8d98-7f0811b1034c.png) 

### 4、jar 包构建

虽然命令行程序已经开发完成，但是不能每次都让用户在 Main 方法里修改参数吧？

我们可以将代码生成器打成 jar 包，支持用户执行并使用命令行工具动态输入参数。1638649696178216961_0.5654421272999011

构建 jar 包的流程并不复杂：

1）先修改 `Main.java` 主类，不再强制指定 args 参数，而是通过执行参数获取：

```java
public class Main {

    public static void main(String[] args) {
        CommandExecutor commandExecutor = new CommandExecutor();
        commandExecutor.doExecute(args);
    }
} 
```

2）使用 Maven 打包构建

需要在 `pom.xml` 文件中引入 `maven-assembly-plugin` 插件，从而将依赖库一起打入 jar 包，并且指定 mainClass 路径为 `com.yupi.Main`。

代码如下：  

```xml
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
                        <mainClass>com.yupi.Main</mainClass> <!-- 替换为你的主类的完整类名 -->
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
```

然后执行 `mvn package` 打包命令，即可构建 jar 包：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/9bd4c683-87ff-49e2-83ab-48da04cef89b.png)

可以在项目根目录下看到生成的 jar 包：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/ac5f8e24-adf9-420a-912a-776dc637d199.png)

### 5、测试使用 

得到 jar 包后，我们就可以通过 `java -jar` 命令运行 jar 包了。

参考命令格式如下：

```shell
java -jar <jar 包名> generate [..args]
```

1）让我们打开终端并进入到 target 目录中，输入下列命令交互式生成代码：

```bash
java -jar yuzi-generator-basic-1.0-SNAPSHOT-jar-with-dependencies.jar generate -l -o -a
```

执行结果： 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/307ef70e-33a9-4c27-a352-7d9101ec5af7.png)

2）或者直接在命令中指定部分参数，比如作者为 liyupi：

```shell
java -jar yuzi-generator-basic-1.0-SNAPSHOT-jar-with-dependencies.jar generate -l -o -a liyupi
```

执行结果，不会再提示让我们输入作者（因为已经在命令中指定）：

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/d839602e-f0a1-463c-b96a-7157ecd4664b.png)

### 6、封装脚本 

虽然命令行工具已经可以成功使用，但是要输入的命令也太长、太复杂了！

怎么简化调用呢？

可以把命令的调用封装在一个 bash 脚本或者 windows 批处理文件，像封装一个函数一样，简化命令。

#### Linux Bash 脚本

> 适用于 Linux 和 Mac 系统

在项目 `yuzi-generator-basic` 的根目录下创建 `generator` 文件，输入脚本信息： 

```shell
#!/bin/bash
java -jar target/yuzi-generator-basic-1.0-SNAPSHOT-jar-with-dependencies.jar "$@"
```

然后输入命令 `chmod a+x generator` ，给该文件添加可执行权限。

然后就可以简化使用了： 

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/e08955a1-ebf8-43c4-9785-8834c3ca4688.png)

查看帮助提示，很方便！

![image.png](https://pic.code-nav.cn/post_picture/1610518142000300034/7b52823f-918f-49b1-8246-3e9b153f53e1.png)

#### Windows 批处理文件

如果是 Windows 系统，在项目根目录下创建 `generator.bat` 文件，输入脚本信息：

```shell
@echo off
java -jar target/yuzi-generator-basic-1.0-SNAPSHOT-jar-with-dependencies.jar %*
```

在上述批处理文件中：

- @echo off 用于禁止在命令执行时显示命令本身。
- java -jar <jar 包路径> %* 执行 Java 命令，其中 %* 用于将批处理文件接收到的所有参数传递给 Java 应用程

然后就可以在终端中使用啦~

### 命令模式的巧妙运用

不知道大家有没有发现，其实在我们的代码中，已经浑然天成地运用了命令模式！

命令模式的几个要素：

- 命令：`GenerateCommand` 等子命令中实现的 Runnable（或 Callable）接口
- 具体命令：每个子命令类
- 调用方：`CommandExecutor` 命令执行器类
- 接受者：代码生成器 `MainGenerator` 类（实际执行功能的类）
- 客户端：主程序 `Main`

所以如果面试官问到：你的项目中哪里用到了设计模式？

应该就能很好地回答啦~ 

