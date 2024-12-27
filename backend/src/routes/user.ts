import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signinInput, signupInput } from "darshansadashiva.medium-common";
import { Hono } from "hono";
import { sign } from "hono/jwt";


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({
            message : "Invalid Inputs"
        })
    }
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const user = await prisma.user.create({
            data:{
                email : body.username,
                password : body.password,
                name : body.name
            }
        });
        const jwt = await sign({
            id: user.id
        },c.env.JWT_SECRET
        );
        console.log(jwt)
        return c.json({
            jwt
        })
    }catch(e){
        c.status(400)
        return c.json({
            message: "Error creating user"
        })
    }
})
    

userRouter.post("/signin", async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({
        message: "Invalid Inputs",
      });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const user = await prisma.user.findFirst({
        where:{
            email : body.username,
            password: body.password
        }
    })
    if(!user){
        c.status(411)
        return c.json({
            message: "User not found"
        })
    }
    const jwt = await sign({
        id: user.id
    }, c.env.JWT_SECRET)
    return c.json({
        jwt
    })
})