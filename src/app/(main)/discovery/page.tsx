"use client"
import Button from "@/src/components/ui/button"
import InputComponent from "@/src/components/ui/input"

const Discovery = function() {
    return (
        <div>
            <div>
                <p>Button</p>
                <Button text={"Button example"} onSubmit={() => {console.log(123)}} className="bg-gray-50"/>
            </div>
            <div>
                <p>Input</p>
                <InputComponent type="password" placeholder="123123"/>
            </div>
        </div>
    )
}

export default Discovery