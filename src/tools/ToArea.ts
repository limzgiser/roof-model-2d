
import * as turf from '@turf/turf'
import { booleanContains } from "@turf/boolean-contains";

import { booleanCrosses } from "@turf/boolean-crosses";
import { booleanWithin } from "@turf/boolean-within";

// 计算点集合的凸包
function convexHull(points: any) {
    // 1. 按照 x, y 排序
    points = points.sort((a: any, b: any) => a[0] - b[0] || a[1] - b[1]);

    // 2. 构建下凸包
    const lower = [];
    for (let i = 0; i < points.length; i++) {
        while (
            lower.length >= 2 &&
            cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0
        ) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    // 判断三点的方向：
    // 1. 如果返回 > 0，则表示顺时针
    // 2. 如果返回 < 0，则表示逆时针
    // 3. 如果返回 0，则表示三点共线
    function cross(o: any, a: any, b: any) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }
    // 3. 构建上凸包
    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        while (
            upper.length >= 2 &&
            cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0
        ) {
            upper.pop();
        }
        upper.push(points[i]);
    }

    // 4. 合并下凸包和上凸包，去掉重复的点
    lower.pop(); // 移除下凸包的最后一个点（重复的起点）
    upper.pop(); // 移除上凸包的最后一个点（重复的起点）

    return [...lower, ...upper];
}

const filterArea = (areaPoitsList: any, pointsList: any, linesList: any) => {

    let result: any = []


    // var line1 = turf.lineString([
    //     [-2, 2],
    //     [4, 2],
    //   ]);
    //   var line2 = turf.lineString([
    //     [1, 1],
    //     [1, 2],
    //     [1, 3],
    //     [1, 4],
    //   ]);


    let areapoints = areaPoitsList.map((item: any) => item.map((id: any) => pointsList.find((a: any) => a.pid == id).point))

    areapoints.forEach((areaPoints: any) => {
        let points = [...areaPoints, areaPoints[0]]
        var polygon: any = turf.polygon([points]);

        let win = false
        for (let i = 0; i < linesList.length; i++) {
            const element = linesList[i];

            let lip = element.map((item: any) => item.point)

            let pp: any = turf.point([
                (lip[0][0] + lip[1][0]) / 2,
                (lip[0][1] + lip[1][1]) / 2,
            ])


            var withIn = booleanWithin(pp, polygon);

            if (withIn) {
                win = true
                break
            }

        }

        if (!win) {
            result.push(areaPoints)
        }
    });

    return result

    // for (let i = 0; i < areaPoitsList.length; i++) {
    //     const areaPoint = areaPoitsList[i];

    //     if (!areaPoint || areaPoint.length < 3) {
    //         console.warn("分割结果存在节点数小于3的情况")
    //         continue
    //     }

    //     let points: any = []
    //     areaPoint.forEach((id: any) => {
    //         let point = pointsList.find((item: any) => item.pid == id)
    //         if (point) {
    //             points.push(point.point)
    //         }
    //     });

    //     if (lineCroxPolygon(points)) {
    //         continue
    //     }
    //     result.push(areaPoint)
    // }

    return result
}
export {

    convexHull,

    filterArea
}