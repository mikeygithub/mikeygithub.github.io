---
title: 微服务篇-Service Mesh服务网格
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/service-mesh.jpeg
date: 2020-12-10 21:05:59
category: 微服务篇
tags: Service Mesh
---
# Service Mesh

>Service Mesh(服务网格)

# What's a service mesh?
A service mesh, like the open source project Istio, is a way to control how different parts of an application share data with one another. Unlike other systems for managing this communication, a service mesh is a dedicated infrastructure layer built right into an app. This visible infrastructure layer can document how well (or not) different parts of an app interact, so it becomes easier to optimize communication and avoid downtime as an app grows.

Each part of an app, called a “service,” relies on other services to give users what they want. If a user of an online retail app wants to buy something, they need to know if the item is in stock. So, the service that communicates with the company's inventory database needs to communicate with the product webpage, which itself needs to communicate with the user’s online shopping cart. To add business value, this retailer might eventually build a service that gives users in-app product recommendations. This new service will communicate with a database of product tags to make recommendations, but it also needs to communicate with the same inventory database that the product page needed—it’s a lot of reusable, moving parts.

Modern applications are often broken down in this way, as a network of services each performing a specific business function. In order to execute its function, one service might need to request data from several other services. But what if some services get overloaded with requests, like the retailer’s inventory database? This is where a service mesh comes in—it routes requests from one service to the next, optimizing how all the moving parts work together.

Don’t microservices already do this?
A microservices architecture lets developers make changes to an app’s services without the need for a full redeploy. Unlike app development in other architectures, individual microservices are built by small teams with the flexibility to choose their own tools and coding languages. Basically, microservices are built independently, communicate with each other, and can individually fail without escalating into an application-wide outage.


# Microservices architecture
Service-to-service communication is what makes microservices possible. The logic governing communication can be coded into each service without a service mesh layer—but as communication gets more complex, a service mesh becomes more valuable. For cloud-native apps built in a microservices architecture, a service mesh is a way to comprise a large number of discrete services into a functional application.

# How does it work?
A service mesh doesn’t introduce new functionality to an app’s runtime environment—apps in any architecture have always needed rules to specify how requests get from point A to point B. What’s different about a service mesh is that it takes the logic governing service-to-service communication out of individual services and abstracts it to a layer of infrastructure.

To do this, a service mesh is built into an app as an array of network proxies. Proxies are a familiar concept in enterprise IT—if you are accessing this webpage from a work computer, there’s a good chance you just used one:

As your request for this page went out, it was first received by your company’s web proxy…
After passing the proxy’s security measure, it was sent to the server that hosts this page…
Next, this page was returned to the proxy and again checked against its security measures…
And then it was finally sent from the proxy to you.


In a service mesh, requests are routed between microservices through proxies in their own infrastructure layer. For this reason, individual proxies that make up a service mesh are sometimes called “sidecars,” since they run alongside each service, rather than within them. Taken together, these “sidecar” proxies—decoupled from each service—form a mesh network.



A sidecar proxy sits alongside a microservice and routes requests to other proxies. Together, these sidecars form a mesh network.

Without a service mesh, each microservice needs to be coded with logic to govern service-to-service communication, which means developers are less focused on business goals. It also means communication failures are harder to diagnose because the logic that governs interservice communication is hidden within each service.

# How can a service mesh optimize communication?
Every new service added to an app, or new instance of an existing service running in a container, complicates the communication environment and introduces new points of possible failure. Within a complex microservices architecture, it can become nearly impossible to locate where problems have occurred without a service mesh.

That’s because a service mesh also captures every aspect of service-to-service communication as performance metrics. Over time, data made visible by the service mesh can be applied to the rules for interservice communication, resulting in more efficient and reliable service requests.

For example, If a given service fails, a service mesh can collect data on how long it took before a retry succeeded. As data on failure times for a given service aggregates, rules can be written to determine the optimal wait time before retrying that service, ensuring that the system does not become overburdened by unnecessary retries.

# Planning for the future
If you’re building microservices, you probably anticipate certain needs down the road, like scaling rapidly and adding new features to meet business needs. It’s likely that a microservices architecture will look very different a year out from its launch. At first, libraries built within microservices might be able to handle service-to-service communication with minimal disruption to operations. If you’re fulfilling the potential of microservices by increasing scale and features, that shouldn’t stay true for long. This can cause problems over time as services get overloaded with requests and developers spend more and more time coding request logic for each service.

# With a service mesh:

Developers can focus on adding business value, instead of connecting services.
Distributed tracing of requests through Jaeger presents a visible infrastructure layer alongside services, so problems are easier to recognize and diagnose.
Apps are more resilient to downtime, since a service mesh can reroute requests away from failed services.
Performance metrics can suggest ways to optimize communication in the runtime environment.
Start planning for the future—experiment with a service mesh on Red Hat® OpenShift® Service Mesh. Experience a uniform way to connect, manage, and observe microservices-based applications with behavioral insight into—and control of—the networked microservices in your service mesh. OpenShift Service Mesh is available (at no cost) for Red Hat OpenShift.

# 参考资料

What's a service mesh? : https://www.redhat.com/en/topics/microservices/what-is-a-service-mesh

复杂环境下落地Service Mesh的挑战与实践-美团技术团队 : https://tech.meituan.com/2020/12/03/service-mesh-in-meituan.html

什么是Service Mesh : https://zhuanlan.zhihu.com/p/61901608

微服务之-ServiceMes : https://www.jianshu.com/p/27a742e349f7   


 
