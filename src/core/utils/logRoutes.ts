
import express from 'express';
import Table from 'cli-table3';
import chalk from 'chalk';

const colorMethod = (method: string) => {
    switch (method) {
        case 'GET':
            return chalk.green(method);
        case 'POST':
            return chalk.blue(method);
        case 'PUT':
            return chalk.yellow(method);
        case 'DELETE':
            return chalk.red(method);
        default:
            return chalk.white(method);
    }
};

function logRoutes(router: express.Router) {

    const groupedRoutes: { [key: string]: { method: string; path: string }[] } = {};

    router.stack.forEach((middleware: any) => {
        if (middleware.route) {

            const path = middleware.route.path;
            const method = Object.keys(middleware.route.methods).join(', ').toUpperCase();
            const root = path.split('/')[1] || '/';

            if (!groupedRoutes[root]) {
                groupedRoutes[root] = [];
            }
            groupedRoutes[root].push({ method, path });
        } else if (middleware.name === 'router' && middleware.handle.stack) {

            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    const subPath = handler.route.path;
                    const method = Object.keys(handler.route.methods).join(', ').toUpperCase();

                    const basePath = middleware.regexp
                        ? middleware.regexp.source
                            .replace(/\\\//g, '/')
                            .replace(/[\^$]/g, '')
                            .replace(/\(\?:\(\?=\/\|\$\)\)\?/, '')
                        : '';

                    const fullPath = `${basePath}${subPath}`.replace('?(?=/|)/', '');

                    const root = basePath.split('/')[1] || '/';
                    if (!groupedRoutes[root]) {
                        groupedRoutes[root] = [];
                    }
                    groupedRoutes[root].push({ method, path: fullPath });
                }
            });
        }
    });

    console.log(`\nRoutes Board:`)
    Object.keys(groupedRoutes).forEach(root => {
        const table = new Table({
            head: ['Method', `=> ${root.charAt(0).toUpperCase() + root.slice(1)}`],
            colWidths: [10, 50],
        });


        groupedRoutes[root].forEach(route => {
            table.push([colorMethod(route.method), route.path]);
        });

        console.log(`${table.toString()}`)
    });

}

export default logRoutes;
