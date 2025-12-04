<template>
  <div class="card content-box">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="140px">
      <!-- 个人基本信息 -->
      <div class="form-section">
        <h3 class="section-title">个人基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请选择性别">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthdate">
              <el-date-picker v-model="formData.birthdate" type="date" placeholder="请选择出生日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-input v-model="formData.nation" placeholder="请输入民族" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-select v-model="formData.maritalStatus" placeholder="请选择婚姻状况">
                <el-option label="未婚" value="single" />
                <el-option label="已婚" value="married" />
                <el-option label="离异" value="divorced" />
                <el-option label="丧偶" value="widowed" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文化程度" prop="education">
              <el-select v-model="formData.education" placeholder="请选择文化程度">
                <el-option label="小学" value="primary" />
                <el-option label="初中" value="junior" />
                <el-option label="高中" value="senior" />
                <el-option label="大专" value="college" />
                <el-option label="本科" value="bachelor" />
                <el-option label="硕士" value="master" />
                <el-option label="博士" value="doctor" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业" prop="occupation">
              <el-input v-model="formData.occupation" placeholder="请输入职业" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 联系方式 -->
      <div class="form-section">
        <h3 class="section-title">联系方式</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入家庭住址" />
        </el-form-item>
      </div>

      <!-- 医疗相关信息 -->
      <div class="form-section">
        <h3 class="section-title">医疗相关信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="formData.bloodType" placeholder="请选择血型">
                <el-option label="A型" value="A" />
                <el-option label="B型" value="B" />
                <el-option label="O型" value="O" />
                <el-option label="AB型" value="AB" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过敏史" prop="allergyHistory">
              <el-input v-model="formData.allergyHistory" placeholder="请输入过敏史" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="既往病史" prop="pastIllnesses">
          <el-input v-model="formData.pastIllnesses" type="textarea" placeholder="请输入既往病史" />
        </el-form-item>
        <el-form-item label="家族病史" prop="familyIllnesses">
          <el-input v-model="formData.familyIllnesses" type="textarea" placeholder="请输入家族病史" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="formData.emergencyContact" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyPhone">
          <el-input v-model="formData.emergencyPhone" placeholder="请输入紧急联系人电话" />
        </el-form-item>
      </div>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交注册</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="peopleForm">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";

const formRef = ref();

// 表单数据
const formData = reactive({
  name: "",
  gender: "",
  birthdate: "",
  idCard: "",
  nation: "",
  maritalStatus: "",
  education: "",
  occupation: "",
  phone: "",
  email: "",
  address: "",
  bloodType: "",
  allergyHistory: "",
  pastIllnesses: "",
  familyIllnesses: "",
  emergencyContact: "",
  emergencyPhone: ""
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  birthdate: [{ required: true, message: "请选择出生日期", trigger: "change" }],
  idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
  address: [{ required: true, message: "请输入家庭住址", trigger: "blur" }],
  emergencyContact: [{ required: true, message: "请输入紧急联系人", trigger: "blur" }],
  emergencyPhone: [{ required: true, message: "请输入紧急联系人电话", trigger: "blur" }]
};

// 提交表单
const onSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      ElMessage.success("提交的数据为 : " + JSON.stringify(formData));
    } else {
      ElMessage.error("表单验证失败，请检查输入项");
      return false;
    }
  });
};

// 重置表单
const onReset = () => {
  formRef.value.resetFields();
};
</script>

<style scoped lang="scss">
@import "./index.scss";

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}
</style>
